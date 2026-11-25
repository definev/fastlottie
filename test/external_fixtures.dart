import 'dart:io';

String? skipRlottieFixture(File file) => file.existsSync()
    ? null
    : 'Missing rlottie reference fixture at ${file.path}.';
