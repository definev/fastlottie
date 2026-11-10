#!/usr/bin/env python3
"""Build/run the release harness and persist its measured output, never fake data."""
import argparse
import json
import hashlib
import os
from pathlib import Path
import signal
import subprocess
import re
from datetime import datetime, timezone

ROOT = Path(__file__).resolve().parents[1]
p = argparse.ArgumentParser()
p.add_argument('--device', default='macos')
p.add_argument('--target', default='lib/benchmark.dart')
p.add_argument('--output', default='docs/benchmark-macos.json')
args = p.parse_args()
def fingerprint():
    digest=hashlib.sha256()
    for pattern in ['lib/**/*.dart','example/lib/**/*.dart','example/assets/*.json','example/assets/tgs/**/*.tgs']:
        for file in sorted(ROOT.glob(pattern)):
            digest.update(str(file.relative_to(ROOT)).encode())
            digest.update(file.read_bytes())
    return digest.hexdigest()
source_before=fingerprint()
def android_state():
    def read(*command):
        return subprocess.check_output(['adb', '-s', args.device, 'shell', *command], text=True, timeout=10).strip()
    try:
        battery = read('dumpsys', 'battery')
        thermal = read('dumpsys', 'thermalservice')
        temperatures = thermal.split('Current temperatures from HAL:', 1)[-1].split('Current cooling devices', 1)[0]
        return {
            'captured_utc': datetime.now(timezone.utc).isoformat(),
            'model': read('getprop', 'ro.product.model'),
            'android': read('getprop', 'ro.build.version.release'),
            'cpu_ticks_per_second': read('getconf', 'CLK_TCK'),
            'battery_celsius': int(re.search(r'temperature: (\d+)', battery)[1])/10,
            'thermal_status': int(re.search(r'Thermal Status: (\d+)', thermal)[1]),
            'temperatures': [{'celsius': float(v), 'name': name, 'status': int(status)} for v, name, status in re.findall(r'mValue=([\d.]+), mType=[-\d]+, mName=([^,]+), mStatus=(\d+)', temperatures)],
        }
    except (subprocess.SubprocessError, OSError, TypeError, IndexError, ValueError):
        return None

android_before = android_state() if args.device != 'macos' else None
output = ROOT / args.output
output.parent.mkdir(parents=True, exist_ok=True)
if args.device == 'macos':
    subprocess.run(['flutter','build','macos','--release','-t',args.target],cwd=ROOT/'example',check=True)
    command = ['caffeinate','-di',str(ROOT/'example/build/macos/Build/Products/Release/fastlottie_example.app/Contents/MacOS/fastlottie_example')]
else:
    command = ['flutter','run','--release','-d',args.device,'-t',args.target]
process = subprocess.Popen(command,cwd=ROOT/'example',stdout=subprocess.PIPE,stderr=subprocess.STDOUT,text=True,start_new_session=True)
result = None
chunks = []
try:
    with output.with_suffix('.log').open('w') as log:
        for line in process.stdout:
            log.write(line); log.flush()
            if 'FASTLOTTIE_CHUNK:' in line:
                chunks.append(line.split('FASTLOTTIE_CHUNK:',1)[1].rstrip('\n'))
                continue
            if 'FASTLOTTIE_DONE' in line:
                result = json.loads(''.join(chunks))
                if fingerprint()!=source_before:
                    raise SystemExit('Source changed during measurement; rerun the benchmark')
                result['source_sha256'] = source_before
                result['device'] = args.device
                if android_before:
                    result['android_before_flutter_run'] = android_before
                    result['android_after_run'] = android_state()
                if args.device=='macos':
                    result['cpu']=subprocess.check_output(['sysctl','-n','machdep.cpu.brand_string'],text=True).strip()
                result['flutter_version'] = subprocess.check_output(['flutter','--version'],text=True)
                output.write_text(json.dumps(result,indent=2)+'\n')
                print(f'Saved {output}',flush=True)
                break
            if 'BENCH ' in line:
                print(line.split(': {',1)[0],flush=True)
            elif 'FASTLOTTIE_ERROR:' in line:
                print(line,flush=True)
finally:
    if android_before:
        # Dart exit() can leave Android restoring the foreground Activity. End
        # this example explicitly so benchmarks never restart/heat in a loop.
        subprocess.run(['adb', '-s', args.device, 'shell', 'am', 'force-stop', 'com.example.fastlottie_example'], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, timeout=10)
    if process.poll() is None:
        os.killpg(process.pid,signal.SIGTERM)
    process.wait(timeout=20)
if result is None:
    raise SystemExit(f'No result; inspect {output.with_suffix(".log")}')
