#!/usr/bin/env bash
# Normaliza la locución de public/video-base.mp4 a -14 LUFS (true peak -1 dBTP)
# y la guarda en public/voz-normalizada.wav (la usa src/components/AudioMix.tsx).
# Ejecuta de nuevo este script cada vez que reemplaces video-base.mp4.
set -euo pipefail
IN="${1:-public/video-base.mp4}"
OUT="${2:-public/voz-normalizada.wav}"

MEASURE=$(ffmpeg -hide_banner -i "$IN" -vn -af loudnorm=I=-14:TP=-1:LRA=11:print_format=json -f null - 2>&1 | sed -n '/^{/,/^}/p')
get() { echo "$MEASURE" | grep "\"$1\"" | sed -E 's/.*: "([^"]+)".*/\1/'; }

ffmpeg -hide_banner -y -i "$IN" -vn \
  -af "highpass=f=70,loudnorm=I=-14:TP=-1:LRA=11:measured_I=$(get input_i):measured_TP=$(get input_tp):measured_LRA=$(get input_lra):measured_thresh=$(get input_thresh):offset=$(get target_offset):linear=true" \
  -ar 48000 -c:a pcm_s16le "$OUT"
echo "OK -> $OUT"
