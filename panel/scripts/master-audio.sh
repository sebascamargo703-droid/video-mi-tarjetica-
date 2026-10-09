#!/usr/bin/env bash
# Normaliza el audio de un render al estándar de redes (-14 LUFS, pico -1.5 dBTP)
# sin volver a codificar el video. Uso: bash scripts/master-audio.sh out/mi-tarjetica-vertical.mp4
set -euo pipefail
in="$1"
tmp="${in%.mp4}.tmp.mp4"
npx remotion ffmpeg -y -loglevel error -i "$in" -c:v copy -af "loudnorm=I=-14:TP=-1.5:LRA=11" -ar 48000 -c:a aac -b:a 192k "$tmp"
mv "$tmp" "$in"
echo "✓ audio masterizado: $in"
