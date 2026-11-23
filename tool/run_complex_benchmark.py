#!/usr/bin/env python3
"""Measure visible Flutter playback and process memory on Android or macOS."""

import argparse
from datetime import datetime, timezone
import hashlib
import json
from pathlib import Path
import re
import signal
import statistics
import subprocess
import time
from urllib.parse import urlencode

from run_chat_memory_benchmark import (
    ACTIVITY, android_sample, android_state, command, request,
)
from run_memory_benchmark import app_executable, mac_sampler, sha


ROOT = Path(__file__).resolve().parents[1]
EXAMPLE = ROOT / 'example'
MANIFEST = EXAMPLE / 'assets/complex_benchmark_fixtures.json'
PACKAGE = 'com.example.fastlottie_example.complexbench'
PORT = 18789
RENDERERS = ('fastlottie', 'lottie')


def check_device(adb):
    if command([*adb, 'get-state']) != 'device':
        raise RuntimeError('Android device is unavailable')


def fingerprint(fixtures):
    paths = [MANIFEST, Path(__file__), EXAMPLE / 'pubspec.lock',
             EXAMPLE / 'lib/complex_benchmark.dart']
    paths.extend(EXAMPLE / asset for asset in fixtures.values())
    for pattern in ('lib/**/*.dart', 'hook/**/*.dart', 'native/**/*'):
        paths.extend(path for path in ROOT.glob(pattern) if path.is_file())
    digest = hashlib.sha256()
    for path in sorted(paths):
        digest.update(str(path.relative_to(ROOT)).encode())
        digest.update(path.read_bytes())
    return digest.hexdigest()


def check_foreground(adb):
    window = command([*adb, 'shell', 'dumpsys', 'window'])
    focus = re.search(r'^\s*mCurrentFocus=.*$', window, re.M)
    if not focus or f'{PACKAGE}/' not in focus[0]:
        raise RuntimeError('Benchmark window lost focus')


def probe_state(path):
    state = request(PORT, path)
    if state['error']:
        raise RuntimeError(state['error'])
    return state


def wait_for(predicate, label):
    deadline = time.monotonic() + 60
    while time.monotonic() < deadline:
        result = predicate()
        if result:
            return result
        time.sleep(.2)
    raise TimeoutError(f'Timed out waiting for {label}')


def run_once(args, binary, adb, config, repeat, logs):
    label = '-'.join(str(config[k]) for k in ('fixture', 'renderer', 'cache', 'instances'))
    prefix = logs / f'{label}-r{repeat}'
    before = android_state(adb) if adb else None
    child = None
    pid = None
    phases = [('baseline', 0), ('loaded', 0)]
    phases.extend((phase, cycle) for cycle in range(1, config['cycles'] + 1)
                  for phase in ('first_frame', 'steady', 'released'))
    phases.append(('settled', config['cycles']))
    with prefix.with_suffix('.log').open('w') as log:
        try:
            if adb:
                command([*adb, 'shell', 'am', 'force-stop', PACKAGE])
                launch = command([*adb, 'shell', 'am', 'start', '-W', '-n',
                                  f'{PACKAGE}/{ACTIVITY}'])
                if 'Status: ok' not in launch:
                    raise RuntimeError(launch)
                pid = int(command([*adb, 'shell', 'pidof', PACKAGE]))
            else:
                child = subprocess.Popen([str(binary)], stdout=log, stderr=subprocess.STDOUT)
                pid = child.pid

            def ready():
                if child and child.poll() is not None:
                    raise RuntimeError(f'Benchmark exited with status {child.returncode}')
                try:
                    return probe_state('/status')
                except OSError:
                    return None

            state = wait_for(ready, 'the benchmark control endpoint')
            if state['pid'] != pid or state['sequence'] != 0:
                raise RuntimeError('Control endpoint belongs to another benchmark process')
            probe_state('/configure?' + urlencode(config))
            read_mac = None if adb else mac_sampler()
            checkpoints = []
            for sequence, (phase, cycle) in enumerate(phases, 1):
                def expected_checkpoint():
                    status = probe_state('/status')
                    if status['sequence'] > sequence:
                        raise RuntimeError(f'Skipped checkpoint {sequence}')
                    return status['checkpoint'] if status['sequence'] == sequence else None

                checkpoint = wait_for(expected_checkpoint, f'{phase}/{cycle}')
                if (checkpoint['phase'], checkpoint['cycle']) != (phase, cycle):
                    raise RuntimeError(f'Expected {phase}/{cycle}, got {checkpoint}')
                if adb:
                    check_foreground(adb)
                if phase == 'steady':
                    loaded = checkpoints[1]
                    frames = checkpoint['frames']
                    if len(frames) != loaded['source_frames'] or any(
                        a['vsync_us'] >= b['vsync_us'] for a, b in zip(frames, frames[1:])
                    ):
                        raise RuntimeError('Incomplete or unordered Flutter frame samples')
                memory = []
                for i in range(args.samples):
                    if i:
                        time.sleep(.25)
                    memory.append(android_sample(adb, pid, log) if adb else read_mac(pid))
                checkpoints.append({**checkpoint, 'memory_samples': memory})
                probe_state(f'/continue?sequence={sequence}')

            def finished():
                status = probe_state('/status')
                return status if status['done'] else None

            state = wait_for(finished, 'the pixel probe')
            return {
                **config, 'repeat': repeat, 'pid': pid, 'checkpoints': checkpoints,
                'pixel_probe': state['probe'], 'android_before': before,
                'android_after': android_state(adb) if adb else None,
            }
        except (OSError, RuntimeError, ValueError, subprocess.SubprocessError) as error:
            raise RuntimeError(f'{label}, repeat {repeat}: {error} (log: {log.name})') from error
        finally:
            if adb:
                command([*adb, 'shell', 'am', 'force-stop', PACKAGE])
            elif child is not None and child.poll() is None:
                child.send_signal(signal.SIGTERM)
                try:
                    child.wait(timeout=10)
                except subprocess.TimeoutExpired:
                    child.kill()
                    child.wait()


def summarize(runs, memory_key):
    groups = {}
    for run in runs:
        key = tuple(run[k] for k in ('fixture', 'renderer', 'cache', 'instances'))
        groups.setdefault(key, []).append(run)

    def memory(checkpoint):
        return statistics.median(sample[memory_key] for sample in checkpoint['memory_samples'])

    def summarize_run(run):
        points = {(p['phase'], p['cycle']): p for p in run['checkpoints']}
        baseline = memory(points['baseline', 0])
        loaded = points['loaded', 0]
        first_frame = points['first_frame', 1]
        steady = points['steady', 1]['timing']
        cycles = run['cycles']
        return {
            'source_frames': loaded['source_frames'],
            'cell_edge_physical': points['baseline', 0]['cell_edge_physical'],
            'parse_compile_us': loaded['parse_compile_us'],
            'first_frame_total_us': first_frame['timing']['total_us']['p50'],
            **{f'p95_{metric}': steady[metric]['p95'] for metric in
               ('paint_us', 'build_us', 'raster_us', 'total_us')},
            'submitted_fps': steady['submitted_fps'],
            'over_budget_total_fraction': steady['over_budget_total'] / steady['samples'],
            'over_budget_stage_fraction': steady['over_budget_stage'] / steady['samples'],
            'baseline_bytes': baseline,
            'loaded_delta_bytes': memory(loaded) - baseline,
            'first_frame_delta_bytes': memory(first_frame) - baseline,
            'steady_delta_bytes': memory(points['steady', 1]) - baseline,
            'peak_sample_bytes': max(s[memory_key] for p in points.values() for s in p['memory_samples']),
            'released_drift_bytes': memory(points['released', cycles]) - memory(points['released', 1]),
            'settled_delta_bytes': memory(points['settled', cycles]) - baseline,
        }

    summary = []
    for (fixture, renderer, cache, instances), group in groups.items():
        readings = [summarize_run(run) for run in group]
        summary.append({
            'fixture': fixture, 'renderer': renderer, 'cache': cache,
            'instances': instances, 'repeats': len(readings),
            **{k: statistics.median(r[k] for r in readings) for k in readings[0]},
        })
    return summary


def main():
    fixtures = json.loads(MANIFEST.read_text())
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--platform', choices=['android', 'macos'], default='android')
    parser.add_argument('--android-device')
    parser.add_argument('--apk', type=Path,
                        default=EXAMPLE / 'build/app/outputs/flutter-apk/app-release.apk')
    parser.add_argument('--macos-app', type=Path, default=EXAMPLE /
                        'build/macos/Build/Products/Release/fastlottie_example.app')
    parser.add_argument('--fixture', choices=fixtures, action='append')
    parser.add_argument('--renderer', choices=RENDERERS, action='append')
    parser.add_argument('--cache', choices=['vector', 'picture'], action='append')
    parser.add_argument('--instances', type=int, choices=[1, 9], action='append')
    parser.add_argument('--edge', type=int, default=360, help='Square playback surface, in logical pixels')
    parser.add_argument('--cycles', type=int, default=5, help='Player mount/unmount cycles for the 9-player case')
    parser.add_argument('--repeats', type=int, default=3, help='Fresh processes per combination')
    parser.add_argument('--samples', type=int, default=3, help='Memory samples per checkpoint')
    parser.add_argument('--output', type=Path, required=True)
    args = parser.parse_args()
    if min(args.cycles, args.repeats, args.samples, args.edge) < 1:
        parser.error('cycles, repeats, samples and edge must be positive')
    adb = None
    if args.platform == 'android':
        if not args.android_device:
            parser.error('--android-device is required on Android')
        adb = ['adb', '-s', args.android_device]
        check_device(adb)
    binary = args.apk if adb else app_executable(args.macos_app)
    memory_key = 'pss_bytes' if adb else 'footprint_bytes'
    logs = args.output.parent / (args.output.stem + '-logs')
    logs.mkdir(parents=True, exist_ok=True)
    source = fingerprint(fixtures)
    result = {
        'schema': 1, 'capture_start_utc': datetime.now(timezone.utc).isoformat(),
        'platform': args.platform, 'device': args.android_device,
        'host_system': command(['uname', '-smr']),
        'git_revision': command(['git', '-C', str(ROOT), 'rev-parse', 'HEAD']),
        'git_status': command(['git', '-C', str(ROOT), 'status', '--porcelain']),
        'flutter_version': command(['flutter', '--version']), 'lottie_version': '3.8.2',
        'source_sha256': source, 'binary_sha256': sha(binary),
        'fixture_sha256': {k: sha(EXAMPLE / v) for k, v in fixtures.items()},
        'memory_metric': memory_key, 'samples_per_checkpoint': args.samples,
        'runs': [],
    }
    if adb:
        command([*adb, 'install', '-r', str(binary)])
        command([*adb, 'forward', '--no-rebind', f'tcp:{PORT}', f'tcp:{PORT}'])
    try:
        renderers = args.renderer or RENDERERS
        for repeat in range(1, args.repeats + 1):
            order = renderers if repeat % 2 else renderers[::-1]
            for fixture in args.fixture or fixtures:
                for cache in args.cache or ('vector', 'picture'):
                    for instances in args.instances or (1, 9):
                        for renderer in order:
                            config = dict(fixture=fixture, cache=cache, renderer=renderer,
                                          instances=instances, edge=args.edge,
                                          cycles=1 if instances == 1 else args.cycles)
                            print(f'{repeat}/{args.repeats}  {fixture}  {cache}  {instances}×  {renderer}', flush=True)
                            run = run_once(args, binary, adb, config, repeat, logs)
                            if fingerprint(fixtures) != source:
                                raise RuntimeError('Benchmark source changed during measurement')
                            result['runs'].append(run)
                            result['summary'] = summarize(result['runs'], memory_key)
                            args.output.write_text(json.dumps(result, indent=2) + '\n')
    finally:
        if adb:
            command([*adb, 'forward', '--remove', f'tcp:{PORT}'])
    print(f'Saved {args.output.resolve()}', flush=True)


if __name__ == '__main__':
    main()
