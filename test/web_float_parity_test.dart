import 'dart:convert';
import 'dart:typed_data';
import 'dart:ui' as ui;

import 'package:archive/archive.dart';
import 'package:fastlottie/fastlottie.dart';
import 'package:flutter/widgets.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  test('GZip decode on web handles high bit in CRC32', () {
    // Generate data with CRC32 having bit 31 set.
    final raw = Uint8List.fromList(
      utf8.encode(
        jsonEncode({
          'v': '5.5.2',
          'fr': 30,
          'ip': 0,
          'op': 60,
          'w': 100,
          'h': 100,
          'layers': [],
        }),
      ),
    );
    final encoded = GZipEncoder().encode(raw);
    final decoded = decodeLottieBytes(encoded);
    expect(decoded, isNotEmpty);
    final json = jsonDecode(utf8.decode(decoded)) as Map<String, dynamic>;
    expect(json['v'], '5.5.2');
  });

  test(
    'Bézier icon straight lines with float noise render without glitch',
    () async {
      // Icon geometry with a square having straight lines and subpixel tangent noise
      final json = {
        'v': '5.5.2',
        'fr': 60,
        'ip': 0,
        'op': 60,
        'w': 100,
        'h': 100,
        'layers': [
          {
            'ty': 4,
            'ip': 0,
            'op': 60,
            'ks': {
              'o': {'a': 0, 'k': 100},
              'r': {'a': 0, 'k': 0},
              'p': {
                'a': 0,
                'k': [50, 50, 0],
              },
              'a': {
                'a': 0,
                'k': [0, 0, 0],
              },
              's': {
                'a': 0,
                'k': [100, 100, 100],
              },
            },
            'shapes': [
              {
                'ty': 'gr',
                'it': [
                  {
                    'ty': 'sh',
                    'ks': {
                      'a': 1,
                      'k': [
                        {
                          't': 0,
                          's': [
                            {
                              'v': [
                                [10, 10],
                                [90, 10],
                                [90, 90],
                                [10, 90],
                              ],
                              'i': [
                                [0, 0],
                                [0, 0],
                                [0, 0],
                                [0, 0],
                              ],
                              'o': [
                                [0, 0],
                                [0, 0],
                                [0, 0],
                                [0, 0],
                              ],
                              'c': true,
                            },
                          ],
                          'e': [
                            {
                              'v': [
                                [20, 20],
                                [80, 20],
                                [80, 80],
                                [20, 80],
                              ],
                              'i': [
                                [1e-7, -1e-7],
                                [0, 0],
                                [0, 0],
                                [0, 0],
                              ],
                              'o': [
                                [0, 0],
                                [0, 0],
                                [0, 0],
                                [-1e-7, 1e-7],
                              ],
                              'c': true,
                            },
                          ],
                          'o': {
                            'x': [0.42],
                            'y': [0.0],
                          },
                          'i': {
                            'x': [0.58],
                            'y': [1.0],
                          },
                        },
                        {
                          't': 60,
                          's': [
                            {
                              'v': [
                                [20, 20],
                                [80, 20],
                                [80, 80],
                                [20, 80],
                              ],
                              'i': [
                                [0, 0],
                                [0, 0],
                                [0, 0],
                                [0, 0],
                              ],
                              'o': [
                                [0, 0],
                                [0, 0],
                                [0, 0],
                                [0, 0],
                              ],
                              'c': true,
                            },
                          ],
                        },
                      ],
                    },
                  },
                  {
                    'ty': 'fl',
                    'c': {
                      'a': 0,
                      'k': [0.2, 0.4, 0.8],
                    },
                    'o': {'a': 0, 'k': 100},
                    'r': 1,
                  },
                  {
                    'ty': 'st',
                    'c': {
                      'a': 0,
                      'k': [1.0, 0.0, 0.0],
                    },
                    'o': {'a': 0, 'k': 100},
                    'w': {'a': 0, 'k': 2},
                    'lc': 2,
                    'lj': 2,
                    'ml': 4,
                  },
                  {
                    'ty': 'tr',
                    'p': {
                      'a': 0,
                      'k': [0, 0],
                    },
                    'a': {
                      'a': 0,
                      'k': [0, 0],
                    },
                    's': {
                      'a': 0,
                      'k': [100, 100],
                    },
                    'r': {'a': 0, 'k': 0},
                    'o': {'a': 0, 'k': 100},
                  },
                ],
              },
            ],
          },
        ],
      };

      final comp = FastLottieComposition.fromJson(json);
      final player = FastLottiePlayer(comp, cache: FastLottieCache.none);
      addTearDown(player.dispose);

      // Render at multiple frames including boundary frames
      final recorder = ui.PictureRecorder();
      final canvas = Canvas(recorder);
      const rect = Rect.fromLTWH(0, 0, 100, 100);

      for (final progress in [0.0, 0.0000001, 0.5, 0.9999999, 1.0]) {
        player.draw(canvas, rect, progress, useFrameRate: false);
      }
      final picture = recorder.endRecording();
      final image = await picture.toImage(100, 100);
      expect(image.width, 100);
      expect(image.height, 100);
      image.dispose();
      picture.dispose();
    },
  );

  test(
    'Icon with rounded rect and rotation renders cleanly across frames',
    () async {
      final json = {
        'v': '5.12.2',
        'fr': 30,
        'ip': 0,
        'op': 60,
        'w': 256,
        'h': 256,
        'layers': [
          {
            'ty': 4,
            'ind': 1,
            'ip': 0,
            'op': 60,
            'ks': {
              'a': {
                'a': 0,
                'k': [0, 0],
              },
              'p': {
                'a': 0,
                'k': [0, 0],
              },
              'r': {'a': 0, 'k': 0},
              's': {
                'a': 0,
                'k': [100, 100],
              },
              'o': {'a': 0, 'k': 100},
            },
            'shapes': [
              {
                'ty': 'gr',
                'it': [
                  {
                    'ty': 'rc',
                    'p': {
                      'a': 0,
                      'k': [0, 0],
                    },
                    's': {
                      'a': 0,
                      'k': [110, 110],
                    },
                    'r': {
                      'a': 1,
                      'k': [
                        {
                          't': 0,
                          's': [0.0],
                          'e': [18.0],
                        },
                        {
                          't': 60,
                          's': [18.0],
                        },
                      ],
                    },
                  },
                  {
                    'ty': 'fl',
                    'c': {
                      'a': 0,
                      'k': [0.12, 0.63, 0.9],
                    },
                    'o': {'a': 0, 'k': 100},
                    'r': 1,
                  },
                  {
                    'ty': 'st',
                    'c': {
                      'a': 0,
                      'k': [0.9, 0.3, 0.2],
                    },
                    'o': {'a': 0, 'k': 100},
                    'w': {'a': 0, 'k': 3},
                    'lc': 2,
                    'lj': 2,
                    'ml': 4,
                  },
                  {
                    'ty': 'tr',
                    'a': {
                      'a': 0,
                      'k': [0, 0],
                    },
                    'p': {
                      'a': 0,
                      'k': [128, 128],
                    },
                    'r': {
                      'a': 1,
                      'k': [
                        {
                          't': 0,
                          's': [0],
                          'e': [360],
                          'h': 0,
                          'o': {
                            'x': [0],
                            'y': [0],
                          },
                          'i': {
                            'x': [1],
                            'y': [1],
                          },
                        },
                        {
                          't': 60,
                          's': [360],
                        },
                      ],
                    },
                    's': {
                      'a': 0,
                      'k': [100, 100],
                    },
                    'o': {'a': 0, 'k': 100},
                  },
                ],
              },
            ],
          },
        ],
      };

      final comp = FastLottieComposition.fromJson(json);
      final player = FastLottiePlayer(comp, cache: FastLottieCache.none);
      addTearDown(player.dispose);

      const size = 256;
      const rect = Rect.fromLTWH(0, 0, size * 1.0, size * 1.0);
      for (var f = 0.0; f <= 60.0; f += 5.0) {
        final recorder = ui.PictureRecorder();
        final canvas = Canvas(recorder);
        player.draw(canvas, rect, f / 60.0, useFrameRate: false);
        final pic = recorder.endRecording();
        final img = await pic.toImage(size, size);
        expect(img.width, size);
        img.dispose();
        pic.dispose();
      }
    },
  );
}
