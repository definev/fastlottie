import '../platform/isolate_stub.dart'
    if (dart.library.isolate) '../platform/isolate_io.dart';

int browserRasterWorkerCount(int? override) => 1;
WorkerHandle? startBrowserRasterWorker(String name) => null;
bool isBrowserRasterWorker(WorkerHandle handle) => false;
bool browserRasterWorkerUsesWasm(WorkerHandle handle) => false;
