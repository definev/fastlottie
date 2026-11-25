import 'dart:io';

const tgsCorpusPath = 'test/fixtures/tgs';

final _tgsCorpusUri = Directory(tgsCorpusPath).absolute.uri;

String tgsAssetPath(File file) =>
    file.absolute.uri.path.substring(_tgsCorpusUri.path.length);

List<File> tgsFixtures() =>
    Directory(tgsCorpusPath)
        .listSync(recursive: true)
        .whereType<File>()
        .where((file) => file.path.endsWith('.tgs'))
        .toList()
      ..sort((a, b) => a.path.compareTo(b.path));
