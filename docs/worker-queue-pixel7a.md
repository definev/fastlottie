# First raster image scheduling on Pixel 7a

First-image requests now wait in the host queue while their worker has a raster request outstanding. A tile that loses its last user can drop that request before sending bytes or rasterizing. A seek can replace a queued request, and speculative lookahead cannot evict a queued foreground request. Native playback that already has an image can still send work ahead. The total in-flight limit continues to cover both worker requests and image creation.

## Release workload

Pixel 7a, Android 17, ARM64 with native raster enabled. The baseline is `a4dcb12`; both builds use the same benchmark. Each build runs in three fresh processes, alternating order in pairs. The thermal status at the start and end ranges from 1 to 2. There is no fetch, parsing, disk cache or viewport measurement in these timed samples.

Each process runs six bursts. A burst requests 24 different 128 px TGS images in one turn, then releases the first 16 before any replies are handled. Time to first image is the time from the first draw request to an installed `ui.Image` for the eight remaining tiles. The benchmark then starts a fresh cache and drives 16 resident tiles at 30 sample ticks per second for six seconds. CPU time is the change in process user and system ticks, at 100 ticks per second.

| Metric | Baseline | First-image limit |
| --- | ---: | ---: |
| Requests dispatched per burst | 16 | 10 |
| First image p95, median across bursts | 56.8 ms | 49.7 ms |
| CPU time, total across 18 bursts | 3.07 s | 2.99 s |
| Playback exact raster hit rate, median | 99.86% | 99.93% |
| Playback CPU time, median | 8.00 s | 7.43 s |

The dispatch reduction repeats in every burst. First-image timings vary between processes; these results do not establish an app-wide CPU or battery reduction. An earlier one-request-per-worker limit across all traffic had a playback run with 91.4% raster hits and was not kept. A two-request limit across all traffic reduced dispatches to 13 per burst but increased first-image p95 to 60.4 ms in its own A/B.

The [recorded samples](worker-queue-pixel7a.json) can be reproduced from `example/` with `flutter run --release -d <device> -t lib/worker_queue_benchmark.dart`. Compare against `a4dcb12` using the same benchmark source and `--dart-define=QUEUE_VARIANT=baseline`. The app logs one `FASTLOTTIE_QUEUE_SAMPLE` per measurement.

## Chat check

One release run per build used the [chat workload](chat-memory-benchmark.md), Mini-Strip and its normal cache budgets. The candidate ran first; Android reported thermal status 2 before and after both runs. CPU is averaged between checkpoint samples and includes the settling period. PSS is one sample at the checkpoint.

| Checkpoint | Process CPU, baseline → candidate (% of one core) | PSS, baseline → candidate |
| --- | ---: | ---: |
| Sticker scroll | 312 → 298% | 436.9 → 460.7 MiB |
| Emoji scroll | 300 → 305% | 443.1 → 489.6 MiB |
| Five picker cycles | 261 → 269% | 545.3 → 582.7 MiB |

The candidate dispatched more jobs in these chat intervals, despite abandoning fewer requests in the controlled burst. The chat runs do not show a consistent CPU, throughput or memory benefit. They also do not measure elapsed time from tile visibility to first paint. The current evidence supports a narrower benefit: less obsolete work before an image exists during a rapid change of visible tiles.
