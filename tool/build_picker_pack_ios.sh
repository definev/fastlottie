#!/bin/sh
# Run from the repository root. The generated bundle assets are ignored by Git.
set -eu
picker_stage=example/assets/texture_picker_models.flp
for picker_file in "$picker_stage" "$picker_stage.json" "$picker_stage.tmp" "$picker_stage.json.tmp"; do
    if [ -e "$picker_file" ] || [ -L "$picker_file" ]; then
        printf 'Remove the existing staging file first: %s\n' "$picker_file" >&2
        exit 1
    fi
done
trap 'rm -f "$picker_stage" "$picker_stage.json" "$picker_stage.tmp" "$picker_stage.json.tmp"' EXIT
picker_compiler=$(python3 - <<'PY'
import hashlib
from pathlib import Path
h = hashlib.sha256(b'fastlottie-picker-pack-v1\0')
for p in sorted([*Path('lib').glob('**/*.dart'), *Path('example/lib/tgs').glob('compiled_pack*.dart'),
                 Path('example/lib/tgs/decoder.dart'), Path('tool/build_compiled_picker_pack.dart'),
                 Path('example/pubspec.yaml')]):
    h.update(p.as_posix().encode() + b'\0' + p.read_bytes() + b'\0')
print(h.hexdigest())
PY
)
dart --define=FASTLOTTIE_FUSED_FILL=true run tool/build_compiled_picker_pack.dart "$picker_compiler"
(cd example && flutter build ios --release -t lib/texture_picker_benchmark.dart \
  --dart-define=FASTLOTTIE_NATIVE_BEZIER=true \
  --dart-define=FASTLOTTIE_FUSED_FILL=true \
  --dart-define="FASTLOTTIE_PACK_COMPILER=$picker_compiler" "$@")
