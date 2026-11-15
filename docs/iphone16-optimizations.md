# Cache eviction and first-image scheduling on iPhone 16

This comparison uses signed Flutter release builds on a physical iPhone 16 (iOS 27.0.1, wired to Xcode 27.2). The three builds use the same workload and dependencies: baseline `028e801`, scene cache eviction `a4dcb12`, and the scene cache build plus the first-image scheduler. Flutter is 3.51.0-0.1.pre (666d2c4e83). Native raster was enabled in all builds. The execution order was baseline → scene → both → both → scene → baseline. Each suite started in a separate process, so the raster microbenchmarks did not warm the chat.

## Controlled tests

The scene test runs the two cache policies in the same executable and alternates their order. Four 128 px TGS scenes stay resident while a fifth scene is rendered and removed in each round. Each policy has six passes per process, with 64 warm-up rounds and 192 measured rounds per pass. All sampled pixel checksums match.

The queue test requests 24 images and releases 16 tiles before worker replies are handled. It reports latency from the draw request to installation of the first `ui.Image` for the eight surviving tiles. This is not the time to first paint in the chat. Each fresh process runs six bursts, then drives 16 resident tiles at 30 sample ticks per second for six seconds.

The two standalone workloads come from `example/lib/scene_cache_benchmark.dart` and `example/lib/worker_queue_benchmark.dart`. The local `build/iphone-optimization-ab/` directory contains signed build snapshots and the combined driver, its device runner, and the raw outputs. The report JSON includes the renderer source hashes and the individual measurements.

The cache policy comparison has 24 passes per policy across four processes. Median time per round decreases from **1.46 to 0.94 ms**; median p95 decreases from **2.04 to 1.38 ms (−32%)**. The benefit is specific to frequent eviction in a shared raster workspace.

When adding the scheduler to the scene cache build, dispatched jobs fall from **16 to 10 in every burst**, and the median first-image p95 falls from **12.80 to 9.42 ms (−26%)**. Both builds return exact raster images for **99.93%** of the steady playback lookups. Median process CPU time across the complete queue suite is 4.40 s for scene-only and 4.30 s with both changes. That suite includes asset loading, six bursts, and six seconds of playback, so the CPU number does not isolate scrolling.

## Chat workload

A separate process runs the standard Mini-Strip chat workload with fresh source and raster cache directories, the same production cache budgets, and unbounded `ui.Picture` retention for large stickers. Local bundled TGS fixtures eliminate external network variation. Each checkpoint has three seconds of settling followed by two seconds of measured playback. Active scrolling is measured separately. CPU is the change in process user + system CPU time from `getrusage`, divided by elapsed system uptime (100% = one fully occupied core). Memory is an endpoint sample of `task_vm_info.phys_footprint`, including the process beyond FastLottie. Frame p95 uses Flutter callbacks, which are delivered in batches and can cross phase boundaries.

Compare like thermal states. The phone was at `fair` in the first baseline/scene chat runs; the first scheduler run reached `serious` after the initial scrolls. The second scheduler run was at `serious`. Two non-scroll intervals in that first scheduler run (`chat_idle` and `picker_open`) are omitted from aggregate comparisons because the app was not active at one endpoint. Power draw and GPU utilization were not measured in this A/B.

| Chat metric | Baseline | Scene cache | Both |
| --- | ---: | ---: | ---: |
| CPU, first sticker scroll at `fair` | 250% | 254% | 264% |
| CPU, first emoji scroll at `fair` | 202% | 208% | 215% |
| CPU, first sticker scroll at `serious` | 265% | 275% | 246% |
| CPU, first emoji scroll at `serious` | 218% | 215% | 209% |
| CPU, all seven scroll intervals at `serious` | 265% | 261% | 253% |
| Jobs dispatched over all seven scroll intervals at `serious` | 4,947 | 4,987 | 4,958 |
| Footprint after closing picker, midpoint of both runs | 401.7 MiB | 406.9 MiB | 407.5 MiB |
| Footprint after five picker cycles, midpoint of both runs | 428.8 MiB | 435.3 MiB | 422.0 MiB |

Each thermal-matched CPU or dispatch cell above is one run. “All seven scroll intervals” weights CPU by measured scroll time, about 18.4 seconds; it excludes the pauses between scroll intervals. The early scroll CPU results change direction between thermal states and the matched job count during chat barely changes. The memory endpoints also change direction. These chat runs do not establish a consistent end-to-end CPU, memory, frame-timing or thermal improvement. The controlled tests show the specific benefit of each change: cheaper raster work when scenes are evicted and faster first raster images when a burst is canceled.

[Machine-readable results and individual samples](iphone16-optimizations.json).
