import 'package:flutter/foundation.dart';
import 'package:flutter/services.dart';

import 'network_server_types.dart';

class LocalTgsServer {
  LocalTgsServer._();

  static Future<LocalTgsServer> startFromBundle({
    AssetBundle? bundle,
    String host = '127.0.0.1',
    int port = 0,
    Duration simulatedLatency = Duration.zero,
  }) => Future<LocalTgsServer>.error(
    UnsupportedError('Embedded HTTP server requires dart:io'),
  );

  static Future<LocalTgsServer> startFromDirectoryPath(
    String directoryPath, {
    String host = '127.0.0.1',
    int port = 0,
    Duration simulatedLatency = Duration.zero,
    bool restrictTopicsToBundled = true,
  }) => Future<LocalTgsServer>.error(
    UnsupportedError('Embedded HTTP server requires dart:io'),
  );

  Uri get baseUri => throw UnsupportedError('Not available without dart:io');
  TgsRemoteCatalog get catalog =>
      throw UnsupportedError('Not available without dart:io');
  ValueListenable<LocalTgsServerStats> get stats =>
      throw UnsupportedError('Not available without dart:io');
  Duration get simulatedLatency => Duration.zero;
  set simulatedLatency(Duration value) {}
  bool get simulateFailure => false;
  set simulateFailure(bool value) {}

  Future<void> close({bool force = false}) async {}
}

Future<TgsRemoteCatalog> fetchRemoteTgsCatalog(
  Uri baseUri, {
  Duration timeout = const Duration(seconds: 5),
}) => Future<TgsRemoteCatalog>.error(
  UnsupportedError('HTTP client requires dart:io'),
);
