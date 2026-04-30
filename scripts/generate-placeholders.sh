#!/usr/bin/env bash
# generate-placeholders.sh
# Writes one SVG per image slot into /assets/images/_placeholders/.
# The site reads /assets/images/<folder>/<file>.jpg first; if that 404s,
# image-fallback.js swaps to /assets/images/_placeholders/<slot>.svg.
#
# Re-run any time you add a slot to assets/data/images.json.
# No external deps — pure Bash + heredocs.

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT="$ROOT/assets/images/_placeholders"
mkdir -p "$OUT"

# slot|aspect|label
# aspect is W:H — controls the SVG viewBox.
SLOTS=(
  "hero-homepage|16:9|Homepage hero — couple at golden hour, 30A"
  "hero-homepage-mobile|4:5|Homepage hero, vertical mobile crop"
  "hero-portfolio|21:9|Portfolio hero — cinematic editorial portrait"
  "hero-about|16:9|About hero — Shane behind the camera"
  "homepage-feature-weddings|4:5|Weddings — bridal moment, ceremony or first look"
  "homepage-feature-engagements|4:5|Engagements — couple, golden hour outdoor"
  "homepage-feature-elopements|4:5|Elopements — intimate, two-person, quiet"
  "homepage-feature-destination|4:5|Destination — beach, turquoise water, white dress"
  "homepage-story-1|3:2|Story row 1 — narrative wedding moment"
  "homepage-story-2|3:2|Story row 2 — beach detail or candid"
  "homepage-final-cta|16:9|Final CTA — wide silhouette or environmental portrait"
  "about-portrait|3:4|About — vertical portrait of Shane"
  "about-bts-1|3:2|About — behind-the-scenes shooting"
  "package-essential|4:5|Package: Essential — entry tier card"
  "package-signature|4:5|Package: Signature — mid tier card"
  "package-heirloom|4:5|Package: Heirloom — premium card with album"
  "lead-magnet-cover|3:4|Wedding Planning Guide — tilted PDF mockup"
  "blog-cover-default|16:9|Default blog cover"
  "weddings-gallery-item|3:2|Weddings gallery — drop curated images here"
  "engagements-gallery-item|3:2|Engagements gallery — drop curated images here"
  "elopements-gallery-item|3:2|Elopements gallery — drop curated images here"
  "destination-gallery-item|3:2|Destination gallery — drop curated images here"
  "featured-couple-portrait|2:3|Featured — couple portrait, intimate outdoor"
  "featured-bridal-lehenga|2:3|Featured — bridal portrait, ballroom editorial"
  "featured-reception-bhangra|3:2|Featured — bhangra reception celebration"
)

write_svg() {
  local slot="$1"
  local aspect="$2"
  local label="$3"

  local w h
  w="${aspect%:*}"
  h="${aspect#*:}"
  # Scale to integer viewBox values matching the ratio for crisp aspect.
  local vw=$((w * 100))
  local vh=$((h * 100))

  cat > "$OUT/$slot.svg" <<SVG
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 $vw $vh"
     preserveAspectRatio="xMidYMid slice" role="img"
     aria-label="Placeholder: $label">
  <defs>
    <pattern id="dots-$slot" x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse">
      <circle cx="16" cy="16" r="0.7" fill="#b8956a" opacity="0.25"/>
    </pattern>
  </defs>

  <rect width="$vw" height="$vh" fill="#f3ede2"/>
  <rect width="$vw" height="$vh" fill="url(#dots-$slot)"/>

  <!-- thin frame -->
  <rect x="20" y="20" width="$((vw - 40))" height="$((vh - 40))"
        fill="none" stroke="#b8956a" stroke-width="1" opacity="0.45"/>

  <!-- inner ornament: heart-line motif -->
  <g transform="translate($((vw / 2)) $((vh / 2 - 40)))" opacity="0.6">
    <path d="M0 18 C -22 -8, -36 6, 0 30 C 36 6, 22 -8, 0 18 Z"
          fill="none" stroke="#b8956a" stroke-width="1.2" stroke-linecap="round"/>
  </g>

  <!-- label -->
  <text x="$((vw / 2))" y="$((vh / 2 + 30))"
        text-anchor="middle"
        font-family="Cormorant Garamond, Georgia, serif"
        font-style="italic" font-weight="300"
        font-size="32"
        fill="#6b6357">$label</text>

  <!-- slot id (small caption) -->
  <text x="$((vw / 2))" y="$((vh - 36))"
        text-anchor="middle"
        font-family="Cinzel, serif" font-weight="700"
        font-size="14" letter-spacing="3"
        fill="#b8956a" opacity="0.7">$slot</text>
</svg>
SVG
}

count=0
for entry in "${SLOTS[@]}"; do
  IFS='|' read -r slot aspect label <<<"$entry"
  write_svg "$slot" "$aspect" "$label"
  count=$((count + 1))
done

echo "Generated $count placeholder SVGs in $OUT"
