#!/usr/bin/env bash
# process-images.sh — batch-resize a folder of JPEGs into mobile/tablet/desktop
# variants in both JPEG and WebP formats.
#
# Usage:
#   ./scripts/process-images.sh /path/to/folder
#
# Optional. The site renders fine without running this — the browser's srcset
# falls back to whichever size is available, and image-fallback.js shows the
# placeholder SVG if nothing matches.
#
# Requires: imagemagick (`magick` or `convert`) and optionally cwebp.

set -euo pipefail

if [[ ${#@} -lt 1 ]]; then
  echo "Usage: $0 <folder>"
  exit 1
fi

DIR="$1"
[[ -d "$DIR" ]] || { echo "Not a folder: $DIR"; exit 1; }

if command -v magick >/dev/null 2>&1; then
  IM="magick"
elif command -v convert >/dev/null 2>&1; then
  IM="convert"
else
  echo "ImageMagick not found. Install it or use Squoosh manually."
  exit 1
fi

CWEBP=""
command -v cwebp >/dev/null 2>&1 && CWEBP="cwebp"

# Skip files that already have a size suffix.
shopt -s nullglob
for src in "$DIR"/*.jpg "$DIR"/*.jpeg "$DIR"/*.JPG "$DIR"/*.JPEG; do
  base="${src%.*}"
  case "$base" in
    *-mobile|*-tablet|*-desktop) continue ;;
  esac

  echo "Processing $src"

  # JPEG variants
  $IM "$src" -resize "800x800>"  -quality 82 -strip "${base}-mobile.jpg"
  $IM "$src" -resize "1400x1400>" -quality 82 -strip "${base}-tablet.jpg"
  $IM "$src" -resize "2400x2400>" -quality 82 -strip "${base}-desktop.jpg"

  # WebP variants
  if [[ -n "$CWEBP" ]]; then
    $CWEBP -q 78 "${base}-mobile.jpg"  -o "${base}-mobile.webp"  >/dev/null 2>&1 || true
    $CWEBP -q 78 "${base}-tablet.jpg"  -o "${base}-tablet.webp"  >/dev/null 2>&1 || true
    $CWEBP -q 78 "${base}-desktop.jpg" -o "${base}-desktop.webp" >/dev/null 2>&1 || true
  else
    $IM "${base}-mobile.jpg"  -quality 78 "${base}-mobile.webp"
    $IM "${base}-tablet.jpg"  -quality 78 "${base}-tablet.webp"
    $IM "${base}-desktop.jpg" -quality 78 "${base}-desktop.webp"
  fi
done

echo "Done."
