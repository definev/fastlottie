part of 'raster_core.dart';

// Internal Dart messages use named payload fields. The browser codec alone
// maps these records to the versioned positional wire format.
const int opConfigure = 0;
const int opRegisterScene = 1;
const int opRenderFrame = 2;
const int opDeleteDisk = 3;
const int opClearMem = 4;
const int opRenderStrip = 5;

const int repFrameReady = 0;
const int repFrameError = 1;
const int repDeleted = 2;
const int repSceneMissing = 3;
const int repStripReady = 4;
