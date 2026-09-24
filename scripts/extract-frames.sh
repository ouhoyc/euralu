#!/usr/bin/env bash
# ---------------------------------------------------------------------------
# Découpe une vidéo en images WebP pour l'expérience « scroll-scrubbing ».
#
# Usage : scripts/extract-frames.sh <video.mp4> <nom-sequence> [fps]
# Exemple : scripts/extract-frames.sh media/plan-3-gouttiere.mp4 gouttiere 24
#
# Produit dans public/sequences/<nom-sequence>/ :
#   desktop/0001.webp …  1920 px de large, toutes les images   (grands écrans)
#   mobile/0001.webp  …  720×1280 recadré au centre, 1 image sur 2 (téléphones)
#   manifest.json        nombre d'images et dimensions (lu par le composant)
#
# Prérequis : ffmpeg (Ubuntu/Debian : sudo apt install ffmpeg ; macOS : brew install ffmpeg)
# ---------------------------------------------------------------------------
set -euo pipefail

INPUT="${1:?Chemin de la vidéo manquant}"
NAME="${2:?Nom de la séquence manquant}"
FPS="${3:-24}"

OUT="public/sequences/${NAME}"
rm -rf "$OUT"
mkdir -p "$OUT/desktop" "$OUT/mobile"

echo "→ Images grand écran (1920 px, ${FPS} images/s)…"
ffmpeg -hide_banner -loglevel error -i "$INPUT" \
  -vf "fps=${FPS},scale=1920:-2:flags=lanczos" \
  -c:v libwebp -quality 60 -compression_level 6 -preset photo \
  "$OUT/desktop/%04d.webp"

echo "→ Images mobile (720×1280, $((FPS / 2)) images/s)…"
ffmpeg -hide_banner -loglevel error -i "$INPUT" \
  -vf "fps=$((FPS / 2)),crop='min(iw,ih*9/16)':ih,scale=720:1280:flags=lanczos" \
  -c:v libwebp -quality 55 -compression_level 6 -preset photo \
  "$OUT/mobile/%04d.webp"

count() { find "$1" -name '*.webp' | wc -l | tr -d ' '; }
dims() { ffprobe -v error -select_streams v:0 -show_entries stream=width,height -of csv=p=0:s=, "$1/0001.webp"; }

D_COUNT=$(count "$OUT/desktop"); M_COUNT=$(count "$OUT/mobile")
IFS=, read -r D_W D_H <<<"$(dims "$OUT/desktop")"
IFS=, read -r M_W M_H <<<"$(dims "$OUT/mobile")"

cat > "$OUT/manifest.json" <<JSON
{
  "name": "${NAME}",
  "desktop": { "path": "/sequences/${NAME}/desktop", "count": ${D_COUNT}, "width": ${D_W}, "height": ${D_H} },
  "mobile": { "path": "/sequences/${NAME}/mobile", "count": ${M_COUNT}, "width": ${M_W}, "height": ${M_H} }
}
JSON

echo "✓ ${D_COUNT} images grand écran ($(du -sh "$OUT/desktop" | cut -f1)), ${M_COUNT} images mobile ($(du -sh "$OUT/mobile" | cut -f1))"
