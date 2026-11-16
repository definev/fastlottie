#!/usr/bin/env python3
"""Export and aggregate marked scenarios from an iPhone Instruments trace."""
import argparse
from concurrent.futures import ThreadPoolExecutor
import json
from pathlib import Path
import re
import subprocess
import xml.etree.ElementTree as ET


def export(trace, schema, path):
    xpath = f'/trace-toc/run[@number="1"]/data/table[@schema="{schema}"]'
    subprocess.run(['xcrun', 'xctrace', 'export', str(trace), '--xpath', xpath,
                    '--output', str(path)], check=True, stdout=subprocess.DEVNULL)


def rows(path):
    root = ET.parse(path).getroot()
    for node in root.findall('node'):
        ids = {e.get('id'): e for e in node.iter() if 'id' in e.attrib}
        columns = [e.findtext('mnemonic') for e in node.findall('schema/col')]
        for row in node.findall('row'):
            yield {name: ids[e.get('ref')] if 'ref' in e.attrib else e
                   for name, e in zip(columns, row, strict=True)}


def value(row, column):
    return row[column].text


def bounds(row):
    start = int(value(row, 'start'))
    return start, start + int(value(row, 'duration'))


def overlap(a, b):
    return max(0, min(a[1], b[1]) - max(a[0], b[0]))


def mean(interval, series):
    observed = [(overlap(interval, (start, end)), v) for start, end, v in series]
    covered = sum(d for d, _ in observed)
    return {'mean': sum(d * v for d, v in observed) / covered if covered else None,
            'coverage': covered / (interval[1] - interval[0])}


def gpu_impact(trace, process, interval):
    start, end = interval
    # Use Instruments' own aggregation. Averaging the GPU rows alone ignores
    # intervals accounted for by the other subsystem rows in the same table.
    detail = subprocess.check_output([
        'xcrun', 'xctrace', 'show', str(trace), '--track', 'Power Profiler',
        '--summary', 'Summary: Process Power Impact', '--time-start', f'{start}ns',
        '--time-end', f'{end}ns'], text=True)
    for line in detail.splitlines():
        if process not in line:
            continue
        fields = re.split(r'\s{2,}', line.strip())
        if len(fields) == 6:
            return float(fields[3].replace(',', '.'))
    return None


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('trace', type=Path)
    parser.add_argument('--output', type=Path, required=True)
    parser.add_argument('--skip-export', action='store_true',
                        help='Reuse previously exported XML beside the trace')
    parser.add_argument('--phase', action='append', metavar='NAME',
                        help='Select a named signpost interval; repeat to compare phases')
    args = parser.parse_args()

    def table(schema):
        path = args.trace.with_name(f'{args.trace.stem}-{schema}.xml')
        if not args.skip_export:
            export(args.trace, schema, path)
        return list(rows(path))

    markers = [r for r in table('OSSignpostIntervals')
               if value(r, 'subsystem') == 'com.example.fastlottie.instruments'
               and value(r, 'name') == 'Chat Scenario']
    if args.phase:
        markers = [r for r in markers if r['start-message'].get('fmt') in args.phase]
        names = [r['start-message'].get('fmt') for r in markers
                 if int(value(r, 'duration')) > 0]
        if sorted(names) != sorted(set(args.phase)):
            parser.error('Expected exactly one complete interval per requested phase')
    if not markers:
        parser.error('No complete scenario signposts in this trace')
    process, = {r['process'].get('fmt') for r in markers}
    cpu = [(*bounds(r), float(value(r, 'cpu-usage')))
           for r in table('ProcessCPUUsage') if r['process'].get('fmt') == process
           and value(r, 'cpu-usage') is not None]
    thermal = [(bounds(r), value(r, 'thermal-state'))
               for r in table('device-thermal-state-intervals')
               if value(r, 'track-label') == 'Current']
    charging = [bounds(r) for r in table('DeviceChargingState')]
    def summarize(row):
        start, end = interval = bounds(row)
        return {'scenario': row['start-message'].get('fmt'), 'trace_start_s': start / 1e9,
                'duration_s': (end - start) / 1e9,
                'cpu_percent_one_core': mean(interval, cpu),
                'gpu_power_impact': gpu_impact(args.trace, process, interval),
                'thermal': list(dict.fromkeys(s for t, s in thermal if overlap(t, interval))),
                'charger_connected_fraction': sum(overlap(t, interval) for t in charging)
                / (end - start)}

    intervals = [r for r in sorted(markers, key=bounds) if int(value(r, 'duration')) > 0]
    with ThreadPoolExecutor(max_workers=3) as pool:
        results = list(pool.map(summarize, intervals))
    args.output.write_text(json.dumps({'process': process, 'scenarios': results}, indent=2) + '\n')


if __name__ == '__main__':
    main()
