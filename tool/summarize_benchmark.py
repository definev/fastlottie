#!/usr/bin/env python3
"""Render the checked-in raw measurement into the project notes."""
import json
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
j=json.loads((ROOT/'docs/benchmark-macos.json').read_text())
lines=['', '## Kết quả đã đo', '',
 f"Môi trường: {j.get('cpu','macOS ARM64')}, {j['os']}; Flutter release/AOT, lottie {j['lottie']}. "
 f"Đo lúc {j['date_utc']}. Raw: [benchmark-macos.json](benchmark-macos.json).", '',
 'CPU record median, µs/frame; speedup = lottie / fastlottie (cùng cache mode).', '',
 '| Fixture | Vector fast / lottie | Speedup | Picture fast / lottie | Raster fast / lottie |',
 '| --- | ---: | ---: | ---: | ---: |']
for name,value in j['fixtures'].items():
 m=value['modes']
 def pair(mode):
  return f"{m['fast_'+mode]['warm_record']['median_us']:.2f} / {m['lottie_'+mode]['warm_record']['median_us']:.2f}"
 speed=m['lottie_uncached']['warm_record']['median_us']/m['fast_uncached']['warm_record']['median_us']
 lines.append(f'| {name} | {pair("uncached")} | {speed:.2f}× | {pair("picture")} | {pair("raster")} |')
lines += ['', 'Visible FrameTiming **total median**, ms, 9 shared-animation instances. '
 'Đây là số thực trên UI+raster pipeline, khác với CPU record phía trên.', '',
 '| Fixture | Mode | fastlottie | lottie | fast / lottie |', '| --- | --- | ---: | ---: | ---: |']
regressions=[]
for name,value in j['fixtures'].items():
 for mode in ['uncached','picture','raster']:
  a=value['modes']['fast_'+mode].get('visible_frames')
  b=value['modes']['lottie_'+mode].get('visible_frames')
  if not a or not b:continue
  if 'unavailable' in a or 'unavailable' in b:
   lines.append(f'| {name} | {mode} | thiếu timing | thiếu timing | — |');continue
  av=a['total']['median_us'];bv=b['total']['median_us']
  lines.append(f'| {name} | {mode} | {av/1000:.3f} | {bv/1000:.3f} | {av/bv:.2f}× |')
  if av>bv*1.05:regressions.append(f'{name}/{mode} ({av/bv:.2f}× thời gian)')
lines += ['', 'Các mode fastlottie chậm hơn baseline >5% theo total median trong lần đo này: '
 +(', '.join(regressions) if regressions else 'không có')+'. '
 'Không có bảo đảm thắng toàn bộ file hoặc GPU; các regression này vẫn được giữ trong bảng.', '',
 '| Fixture | Parse+compile fast / parse lottie (µs median) | Prewarm raster fast (ms) | RGBA payload |',
 '| --- | ---: | ---: | ---: |']
for name,value in j['fixtures'].items():
 m=value['modes']['fast_raster']
 lines.append(f"| {name} | {value['parse_compile_fast']['median_us']:.0f} / {value['parse_lottie']['median_us']:.0f} | {m['prepare_us']/1000:.2f} | {m['rgba_bytes']/1024/1024:.2f} MiB |")
m=j['fixtures']['morph']['modes']
if 'fast_scalar_uncached' in m:
 scalar=m['fast_scalar_uncached']; simd=m['fast_uncached']; default='SIMD'
else:
 scalar=m['fast_uncached']; simd=m['fast_simd_uncached']; default='Scalar'
a=scalar['warm_record']['median_us'];b=simd['warm_record']['median_us']
lines += ['',f'SIMD morph: scalar {a:.2f} µs, Float32x4 {b:.2f} µs '
 f'({a/b:.2f}× scalar/SIMD). {default} là mặc định ở snapshot này. '
 'Một lần đo chưa chứng minh lợi ích SIMD ổn định trên toàn pipeline hoặc trên thiết bị khác.', '',
 'Các số này xác nhận có lợi ích CPU ở subset đã đo, đồng thời cho thấy GPU/raster '
 'vẫn có thể chi phối. Raster prewarm nên dùng cho vòng lặp ngắn vừa budget; '
 'vector phù hợp khi cần subframe, resize linh hoạt hoặc tránh prewarm latency.', '']
p=ROOT/'docs/benchmarks.md'
text=p.read_text().split('<!-- MEASURED_RESULTS -->')[0]
p.write_text(text+'<!-- MEASURED_RESULTS -->\n'+'\n'.join(lines))
