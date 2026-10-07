#!/usr/bin/env bash
# Convierte las tomas HDR del iPhone (HLG / BT.2020) a SDR BT.709 con un
# tone-mapping neutro (mobius), para que el video se vea igual que en el
# celular y no sobresaturado/anaranjado. Sin ningún look ni filtro de color.
# Uso: bash scripts/hdr-to-sdr.sh   (lee public/user_clips, escribe public/user_clips_sdr)
set -euo pipefail
mkdir -p public/user_clips_sdr
for IN in public/user_clips/take*_*.mp4; do
  OUT="public/user_clips_sdr/$(basename "$IN")"
  ffmpeg -hide_banner -v error -y -i "$IN" -an \
    -vf "zscale=tin=arib-std-b67:min=bt2020nc:pin=bt2020:rin=tv:t=linear:npl=203,format=gbrpf32le,zscale=p=bt709,tonemap=tonemap=mobius:desat=0,zscale=t=bt709:m=bt709:r=tv,format=yuv420p" \
    -c:v libx264 -preset slow -crf 10 -color_primaries bt709 -color_trc bt709 -colorspace bt709 -color_range tv \
    -movflags +faststart "$OUT"
  echo "OK $OUT"
done
