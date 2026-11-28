import 'dart:convert';

/// Resolves an asset path or absolute CDN URL against a document base URI.
Uri resolveBrowserAssetUri(String baseUri, String assetUrl) =>
    Uri.parse(baseUri).resolve(assetUrl);

/// Returns true when [pageUri] and [workerUri] are both HTTP(S) URLs with
/// different origins, requiring a same-origin Blob shim for `new Worker(...)`.
bool isCrossOriginWorkerUri(Uri pageUri, Uri workerUri) {
  final pageHttp = pageUri.isScheme('http') || pageUri.isScheme('https');
  final workerHttp = workerUri.isScheme('http') || workerUri.isScheme('https');
  if (!pageHttp ||
      !workerHttp ||
      pageUri.host.isEmpty ||
      workerUri.host.isEmpty) {
    return false;
  }
  return pageUri.origin != workerUri.origin;
}

/// Builds a minimal classic-worker JavaScript shim that loads [workerUrl]
/// via `importScripts(...)` with safe JSON string escaping.
String buildCrossOriginWorkerShim(String workerUrl) =>
    'importScripts(${jsonEncode(workerUrl)});';
