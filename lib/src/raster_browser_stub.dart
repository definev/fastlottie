import 'isolate_stub.dart' if (dart.library.isolate) 'isolate_io.dart';

WorkerHandle? startBrowserRasterWorker(String name) => null;
bool isBrowserRasterWorker(WorkerHandle handle) => false;
bool browserRasterWorkerUsesWasm(WorkerHandle handle) => false;
