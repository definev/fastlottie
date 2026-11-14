#!/usr/bin/env python3
"""Measure the real release chat workload, including workers and GPU caches."""
import argparse
from datetime import datetime, timezone
import hashlib
import json
import os
from pathlib import Path
import re
import signal
import statistics
import subprocess
import time
import urllib.request

from run_memory_benchmark import app_executable, mac_sampler

ROOT = Path(__file__).resolve().parents[1]
ACTIVITY = 'com.example.fastlottie_example.MainActivity'
PACKAGE = 'com.example.fastlottie_example.chatram'
PHASES = ['chat_idle', 'picker_open', 'sticker_scroll', 'emoji_open',
          'emoji_scroll', 'composer_24_emoji', 'sent_12_stickers',
          'picker_closed', 'churn_1', 'churn_5', 'reduced_motion', 'disposed']


def command(args, **kwargs):
    return subprocess.check_output(args, text=True, timeout=30, **kwargs).strip()


def fingerprint():
    digest = hashlib.sha256()
    for pattern in ('lib/**/*.dart', 'native/**/*', 'hook/**/*.dart',
                    'example/lib/**/*.dart', 'example/assets/**/*.tgs',
                    'example/pubspec.lock', 'tool/run_chat_memory_benchmark.py'):
        for path in sorted(ROOT.glob(pattern)):
            if path.is_file():
                digest.update(str(path.relative_to(ROOT)).encode())
                digest.update(path.read_bytes())
    return digest.hexdigest()


def request(port, path):
    with urllib.request.urlopen(f'http://127.0.0.1:{port}{path}', timeout=10) as r:
        return json.load(r)


def android_sample(adb, pid, log):
    output = command([*adb, 'shell', 'dumpsys', 'meminfo', str(pid)])
    log.write(output + '\n\n')
    log.flush()
    def number(label):
        match = re.search(rf'{label}:\s+(\d+)', output)
        if not match:
            raise ValueError(f'Missing {label} in meminfo for {pid}')
        return int(match[1]) * 1024
    result = {'pss_bytes': number('TOTAL PSS'), 'rss_bytes': number('TOTAL RSS'),
              'swap_pss_bytes': number('TOTAL SWAP PSS')}
    for label in ('Java Heap', 'Native Heap', 'Graphics', 'Private Other', 'System'):
        match = re.search(rf'^\s*{label}:\s+(\d+)', output, re.M)
        if match:
            result[label.lower().replace(' ', '_') + '_pss_bytes'] = int(match[1]) * 1024
    return result


def android_state(adb):
    return {name: command([*adb, 'shell', *args]) for name, args in {
        'model': ['getprop', 'ro.product.model'],
        'android': ['getprop', 'ro.build.version.release'],
        'battery': ['dumpsys', 'battery'],
        'thermal': ['dumpsys', 'thermalservice'],
        'screen_size': ['wm', 'size'], 'screen_density': ['wm', 'density'],
    }.items()}


def run_once(args, platform, mode, repeat, logs, hero_cache='unbounded'):
    adb = ['adb', '-s', args.android_device]
    port = 18788 if platform == 'android' else 18787
    child = None
    pid = None
    prefix = logs / f'{platform}-{mode}-{hero_cache}-{repeat}'
    before = android_state(adb) if platform == 'android' else None
    with prefix.with_suffix('.log').open('w') as log:
        try:
            if platform == 'android':
                command([*adb, 'shell', 'am', 'force-stop', PACKAGE])
                launch = command([*adb, 'shell', 'am', 'start', '-n', f'{PACKAGE}/{ACTIVITY}'])
                if 'Error' in launch:
                    raise RuntimeError(launch)
            else:
                if args.macos_app.is_dir():
                    # Launch the window in front so AppKit does not suspend
                    # Flutter's display link when another app covers it.
                    command(['open', '-n', '-o', str(prefix.with_suffix('.log')),
                             '--stderr', str(prefix.with_suffix('.log')),
                             str(args.macos_app.resolve())])
                else:
                    child = subprocess.Popen([str(app_executable(args.macos_app))],
                                             stdout=log, stderr=subprocess.STDOUT)
            deadline = time.monotonic() + 60
            while True:
                try:
                    state = request(port, f'/configure?mode={mode}&hero_cache={hero_cache}')
                    break
                except (OSError, ValueError):
                    if time.monotonic() > deadline:
                        raise TimeoutError('Control endpoint did not start')
                    time.sleep(.2)
            pid = state['pid']
            if child and pid != child.pid:
                raise ValueError('Control endpoint belongs to another process')
            sample = mac_sampler() if platform == 'macos' else None
            start = time.monotonic()
            results = []
            continuous = []
            for sequence, phase in enumerate(PHASES, 1):
                deadline = time.monotonic() + 90
                next_foreground = 0
                while True:
                    if platform == 'macos' and args.macos_foreground and time.monotonic() >= next_foreground:
                        command(['open', str(args.macos_app.resolve())])
                        next_foreground = time.monotonic() + 2
                    state = request(port, '/status')
                    if state['error']:
                        raise RuntimeError(state['error'])
                    if state['sequence'] == sequence:
                        if state['phase'] != phase:
                            raise ValueError(f'Expected {phase}, got {state}')
                        break
                    if time.monotonic() > deadline:
                        raise TimeoutError(f'Waiting for {phase}')
                    if sample:
                        continuous.append({'elapsed_s': time.monotonic() - start,
                                           **sample(pid)})
                    time.sleep(.25)
                memory = []
                for _ in range(args.samples):
                    memory.append(sample(pid) if sample else android_sample(adb, pid, log))
                    time.sleep(.5)
                state = request(port, '/status')
                telemetry = state['telemetry']
                if platform == 'macos' and args.macos_vmmap:
                    for utility in ('vmmap', 'footprint'):
                        options = ['-summary'] if utility == 'vmmap' else ['-w']
                        capture = subprocess.run([utility, *options, str(pid)],
                                                 text=True, capture_output=True, timeout=30)
                        prefix.with_name(prefix.name + '-' + phase + '-' + utility).with_suffix('.txt').write_text(
                            capture.stdout + capture.stderr)
                if state['error']:
                    raise RuntimeError(state['error'])
                if phase != 'disposed':
                    if platform == 'macos' and phase != 'reduced_motion' and state['frame_timing']['frames'] == 0:
                        raise RuntimeError(f'No rendered frames at {phase}; window may be occluded')
                    if platform == 'android':
                        window = command([*adb, 'shell', 'dumpsys', 'window'])
                        focus = re.search(r'^\s*mCurrentFocus=.*$', window, re.M)
                        if focus is None or f'{PACKAGE}/' not in focus[0]:
                            raise RuntimeError(f'Benchmark lost foreground at {phase}')
                    if telemetry['fetch_errors'] or telemetry['raster_error']:
                        raise RuntimeError(f'Workload error: {telemetry}')
                    if telemetry['emoji_errors'] or telemetry['sticker_errors']:
                        raise RuntimeError(f'Asset error: {telemetry}')
                    expected_picker = phase in PHASES[1:7]
                    if telemetry['picker_open'] != expected_picker or telemetry['store_busy']:
                        raise RuntimeError(f'Invalid checkpoint state: {telemetry}')
                    if telemetry['messages'] != (23 if sequence <= 6 else 36):
                        raise RuntimeError(f'Unexpected message count: {telemetry}')
                if state['hero_cache'] != hero_cache:
                    raise RuntimeError(f'Wrong hero cache: {state}')
                results.append({'phase': phase, 'elapsed_s': time.monotonic() - start,
                                'memory_samples': memory, 'telemetry': telemetry,
                                'frame_timing': state['frame_timing']})
                key = 'footprint_bytes' if sample else 'pss_bytes'
                mib = statistics.median(s[key] for s in memory) / 2**20
                print(f'  {phase}: {mib:.1f} MiB', flush=True)
                request(port, f'/continue?sequence={sequence}')
            deadline = time.monotonic() + 20
            while not request(port, '/status')['done']:
                if time.monotonic() > deadline:
                    raise TimeoutError('Workload did not clean up')
                time.sleep(.1)
            if results[-1]['elapsed_s'] > 120:
                raise RuntimeError('Workload interrupted or too slow (>120s)')
            return {'platform': platform, 'mode': mode, 'repeat': repeat, 'pid': pid,
                    'hero_cache': hero_cache,
                    'before': before, 'after': android_state(adb) if before else None,
                    'samples': results, 'continuous_samples': continuous}
        finally:
            if child:
                child.terminate()
                child.wait(timeout=20)
            elif platform == 'macos' and pid is not None:
                try:
                    os.kill(pid, signal.SIGTERM)
                except ProcessLookupError:
                    pass
            if platform == 'android':
                command([*adb, 'shell', 'am', 'force-stop', PACKAGE])


def summarize(runs):
    rows = []
    for platform, mode, policy in sorted({(r['platform'], r['mode'], r.get('hero_cache', 'unbounded')) for r in runs}):
        group = [r for r in runs if (r['platform'], r['mode'], r.get('hero_cache', 'unbounded')) == (platform, mode, policy)]
        key = 'footprint_bytes' if platform == 'macos' else 'pss_bytes'
        for phase in PHASES:
            values = [statistics.median(s[key] for s in next(
                p for p in r['samples'] if p['phase'] == phase)['memory_samples']) for r in group]
            rows.append({'platform': platform, 'mode': mode, 'phase': phase,
                         'hero_cache': policy,
                         'repeats': len(values), 'metric': key,
                         'median_bytes': statistics.median(values),
                         'min_bytes': min(values), 'max_bytes': max(values)})
    return rows


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--platform', choices=['macos', 'android'], action='append')
    parser.add_argument('--mode', choices=['mini-strip', 'ping-pong', 'lottie'], action='append')
    parser.add_argument('--hero-cache', choices=['unbounded', 'bounded-12'], action='append')
    parser.add_argument('--repeats', type=int, default=3)
    parser.add_argument('--samples', type=int, default=3)
    parser.add_argument('--android-device')
    parser.add_argument('--macos-app', type=Path, default=ROOT / 'example/build/macos/Build/Products/Release/fastlottie_example.app')
    parser.add_argument('--apk', type=Path, default=ROOT / 'example/build/app/outputs/flutter-apk/app-release.apk')
    parser.add_argument('--skip-install', action='store_true')
    parser.add_argument('--macos-vmmap', action='store_true',
                        help='Capture vmmap/footprint at checkpoints (diagnostic runs only)')
    parser.add_argument('--macos-foreground', action='store_true',
                        help='Bring the benchmark window forward every two seconds')
    parser.add_argument('--output', type=Path, required=True)
    args = parser.parse_args()
    if args.repeats < 1 or args.samples < 1:
        parser.error('Repeats and samples must be positive')
    platforms = args.platform or ['macos', 'android']
    if 'android' in platforms and not args.android_device:
        parser.error('--android-device is required for Android')
    modes = args.mode or ['mini-strip', 'ping-pong', 'lottie']
    variants = [(mode, policy) for mode in modes
                for policy in (args.hero_cache or ['unbounded'])]
    adb = ['adb', '-s', args.android_device]
    args.output.parent.mkdir(parents=True, exist_ok=True)
    logs = args.output.parent / (args.output.stem + '-logs')
    logs.mkdir(exist_ok=True)
    source = fingerprint()
    result = {'captured_utc': datetime.now(timezone.utc).isoformat(),
              'source_sha256': source, 'git_revision': command(['git', 'rev-parse', 'HEAD']),
              'flutter_version': command(['flutter', '--version']),
              'macos': command(['sw_vers']), 'cpu': command(['sysctl', '-n', 'machdep.cpu.brand_string']),
              'samples_per_checkpoint': args.samples, 'runs': []}
    if 'android' in platforms:
        if not args.skip_install:
            command([*adb, 'install', '-r', str(args.apk)])
        command([*adb, 'forward', 'tcp:18788', 'tcp:18787'])
    try:
        for platform in platforms:
            binary = app_executable(args.macos_app) if platform == 'macos' else args.apk
            result[platform + '_binary_sha256'] = hashlib.sha256(binary.read_bytes()).hexdigest()
            for repeat in range(1, args.repeats + 1):
                rotation = (repeat - 1) % len(variants)
                for mode, policy in variants[rotation:] + variants[:rotation]:
                    print(f'{platform}: {mode}/{policy} ({repeat}/{args.repeats})', flush=True)
                    result['runs'].append(run_once(args, platform, mode, repeat, logs, policy))
                    if fingerprint() != source:
                        raise RuntimeError('Source changed during measurement')
                    result['summary'] = summarize(result['runs'])
                    args.output.write_text(json.dumps(result, indent=2) + '\n')
    finally:
        if 'android' in platforms:
            command([*adb, 'forward', '--remove', 'tcp:18788'])
    print(f'Saved {args.output}', flush=True)


if __name__ == '__main__':
    main()
