#!/usr/bin/env python3
"""Run chat scroll probe on Android device, capture timing metrics, and summarize."""
import argparse
from bisect import bisect_left
import json
import os
from pathlib import Path
import re
import signal
import statistics
import subprocess
import sys
import time

ROOT = Path(__file__).resolve().parents[1]
PACKAGE = 'com.example.fastlottie_example'


def parse_chat_log(log_path):
    results = []
    if not os.path.exists(log_path):
        return results
    
    phase = None
    positions, frames = [], []
    
    with open(log_path, 'r', errors='ignore') as f:
        for line in f:
            if 'CHAT_PROBE_START ' in line:
                phase = line.split('CHAT_PROBE_START ')[1].split()[0]
                positions, frames = [], []
            elif 'CHAT_POSITION ' in line:
                try:
                    positions.append(json.loads(line.split('CHAT_POSITION ')[1]))
                except Exception:
                    pass
            elif 'CHAT_FRAME ' in line:
                try:
                    frames.append(json.loads(line.split('CHAT_FRAME ')[1]))
                except Exception:
                    pass
            elif 'CHAT_PROBE_END ' in line and phase and positions:
                frame_times = [row[0] for row in frames]
                if frames and len(positions) >= 6 and len(frames) >= 6:
                    offset = statistics.median([f[0] - p[0] for f, p in zip(frames[:6], positions[:6])])
                else:
                    offset = 0
                
                def nearest(t):
                    if not frames:
                        return None
                    t += offset
                    i = bisect_left(frame_times, t)
                    indices = range(max(0, i - 1), min(i + 1, len(frames)))
                    if not indices:
                        return None
                    j = min(indices, key=lambda idx: abs(frame_times[idx] - t))
                    return tuple(frames[j][1:]) if abs(frame_times[j] - t) <= 500 else None

                scroll_frames = [(p[0], p[1], p[2], p[3], nearest(p[0])) for p in positions]
                intervals = [(b[0] - a[0], a, b) for a, b in zip(scroll_frames, scroll_frames[1:])]
                changes = [(a, b) for _, a, b in intervals if abs(a[2] - b[2]) >= .01]
                moving_gaps = [(dt, a, b) for dt, a, b in intervals if dt > 16500]
                measurements = [i[-1] for i in scroll_frames if i[-1] is not None]

                def peak(x):
                    if len(x) >= 20:
                        return (max(x), round(statistics.quantiles(x, n=20)[18]))
                    elif len(x) >= 2:
                        return (max(x), round(statistics.median(x)))
                    elif len(x) == 1:
                        return (x[0], x[0])
                    return (0, 0)

                peaks = [peak(v) for v in zip(*measurements)] if measurements else []
                busy = [(round(t / 1000, 1), round(x, 1), f[0], f[1])
                        for t, x, _, _, f in scroll_frames if f is not None and max(f[:2]) > 11080]

                # Calculate effective presentation FPS
                total_duration_us = (positions[-1][0] - positions[0][0]) if len(positions) > 1 else 0
                frame_count = len(positions)
                effective_fps = (frame_count / (total_duration_us / 1e6)) if total_duration_us > 0 else 0

                results.append({
                    'phase': phase,
                    'start_x': positions[0][1],
                    'end_x': positions[-1][1],
                    'frame_count': frame_count,
                    'effective_fps': round(effective_fps, 2),
                    'bounds_updates': len(changes),
                    'moving_gaps_count': len(moving_gaps),
                    'moving_gaps_ms': [round(dt / 1000, 1) for dt, _, _ in moving_gaps],
                    'busy_frames_count': len(busy),
                    'busy_frames': busy,
                    'peaks_us': peaks,  # [build(max, p95), raster(max, p95), vsyncOverhead(max, p95), totalSpan(max, p95)]
                })
    return results


def run_probe(worktree, device, output_path, timeout_s=180):
    example_dir = Path(worktree) / 'example'
    output_file = Path(output_path).resolve()
    output_file.parent.mkdir(parents=True, exist_ok=True)

    # Force stop before running
    subprocess.run(['adb', '-s', device, 'shell', 'am', 'force-stop', PACKAGE], check=False)
    time.sleep(1)

    cmd = ['flutter', 'run', '-d', device, '-t', '.dart_tool/chat_scroll_probe.dart', '--release']
    print(f"Starting: {' '.join(cmd)} in {example_dir}")

    proc = subprocess.Popen(
        cmd,
        cwd=example_dir,
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT,
        text=True,
        bufsize=1
    )

    lines = []
    start_time = time.monotonic()
    finished = False

    try:
        with open(output_file, 'w') as out_f:
            while True:
                if time.monotonic() - start_time > timeout_s:
                    print(f"Timeout ({timeout_s}s) reached.")
                    break
                line = proc.stdout.readline()
                if not line:
                    if proc.poll() is not None:
                        break
                    time.sleep(0.05)
                    continue
                out_f.write(line)
                out_f.flush()
                lines.append(line)
                
                if 'CHAT_PROBE_' in line:
                    print(f"  [PROBE] {line.strip()}", flush=True)

                if 'CHAT_PROBE_FINISHED' in line:
                    print("Observed CHAT_PROBE_FINISHED, capturing dumpsys meminfo immediately...")
                    time.sleep(1)
                    dumpsys = subprocess.run(
                        ['adb', '-s', device, 'shell', 'dumpsys', 'meminfo', PACKAGE],
                        capture_output=True, text=True, check=False
                    )
                    out_f.write("\n=== DUMPSYS MEMINFO ===\n" + dumpsys.stdout + "\n")
                    out_f.flush()
                    finished = True
                    break
    finally:
        subprocess.run(['adb', '-s', device, 'shell', 'am', 'force-stop', PACKAGE], check=False)
        try:
            proc.terminate()
            proc.wait(timeout=5)
        except Exception:
            try:
                proc.kill()
            except Exception:
                pass

    print(f"Saved probe output to {output_file} (finished={finished})")
    summary = parse_chat_log(output_file)
    return summary


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--worktree', default=str(ROOT))
    parser.add_argument('--device', default='3C091JEHN14062')
    parser.add_argument('--output', required=True)
    parser.add_argument('--timeout', type=int, default=180)
    args = parser.parse_args()

    results = run_probe(args.worktree, args.device, args.output, args.timeout)
    print("\n--- Summary ---")
    for r in results:
        peaks_str = ""
        if r['peaks_us']:
            peaks_str = f"build(max/p95): {r['peaks_us'][0]}, raster(max/p95): {r['peaks_us'][1]}"
        print(f"{r['phase']:<15} | FPS: {r['effective_fps']:>5.1f} | Gaps >16.5ms: {r['moving_gaps_count']:>2} | Busy >11.1ms: {r['busy_frames_count']:>2} | {peaks_str}")
        if r['moving_gaps_ms']:
            print(f"    Gaps (ms): {r['moving_gaps_ms']}")

    # Print memory if available in output file
    if os.path.exists(args.output):
        with open(args.output, 'r', errors='ignore') as f:
            content = f.read()
            if '=== DUMPSYS MEMINFO ===' in content:
                print("\n--- Memory (Dumpsys Meminfo) ---")
                mem_part = content.split('=== DUMPSYS MEMINFO ===')[1]
                for line in mem_part.splitlines():
                    if any(k in line for k in ['Java Heap:', 'Native Heap:', 'Graphics:', 'TOTAL PSS:', 'TOTAL RSS:']):
                        print(line)


if __name__ == '__main__':
    main()
