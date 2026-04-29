# Infinite Love Story

Front-end prototype for **Infinite Love Story**, Shane Drummond's wedding photography brand
covering Florida's Panhandle (30A, Panama City Beach) and destination weddings.

The build is intentionally simple: vanilla HTML, CSS, and JS, no framework, no
package.json. The structure, class names, and section order are designed to
port cleanly to Webflow's Finsweet Client-First system later.

---

## Running locally

The site uses absolute paths (`/assets/...`, `/partials/...`) and JS `fetch()` to
inject shared partials, so it must be served via HTTP — opening files via
`file://` will fail.

```bash
# Pick whichever you have:
python3 -m http.server 8080
# or
npx serve .
# or
php -S localhost:8080
```

Then open <http://localhost:8080/>.

---

## Tech-stack choice: JS fetch includes (not PHP)

Decision: shared partials (header, footer, head meta) are injected via `fetch()` and
a tiny helper at `assets/js/include.js`.

Why JS over PHP:
- Defaults to working anywhere a static host can serve files.
- A Webflow staging environment doesn't run PHP.
- Avoids splitting concerns: data is already JSON-fetched, so partials use the same mechanism.

If we move the prototype to a PHP-capable host, replace each
`<div data-include="/partials/header.html"></div>` with
`<?php include __DIR__ . '/partials/header.html'; ?>` — half-day refactor.

---

## File structure

```
/
├── index.html                  Homepage (step 1: hero only)
├── review.html                 Step-1 review page (hero at 3 breakpoints)
├── pages/                      Inner pages (added in steps 2-6)
├── partials/
│   ├── meta.html               Shared <head> meta + stylesheet links
│   ├── header.html             Nav, mobile overlay, persistent CTA
│   └── footer.html             Footer with wax-seal mark
├── assets/
│   ├── css/
│   │   ├── reset.css           Modern reset
│   │   ├── tokens.css          Design tokens (color, type, spacing, motion)
│   │   ├── typography.css      Type styles + Client-First text utilities
│   │   ├── layout.css          Containers, grids, section padding helpers
│   │   ├── components.css      Buttons, nav, footer, mobile CTA bar
│   │   └── pages.css           Page-specific layout (hero in step 1)
│   ├── js/
│   │   ├── include.js          Partial injector — fires `partials:loaded`
│   │   ├── nav.js               Mobile overlay + transparent-on-hero behavior
│   │   ├── image-fallback.js   Swaps to placeholder SVG on image error
│   │   └── data-loader.js      Cached JSON fetcher (window.ILS.data.load)
│   ├── data/
│   │   ├── site.json           Brand, contact, nav, SEO defaults
│   │   └── images.json         Image manifest (every slot the site reads)
│   ├── svg/                    Decorative motifs (added in step 3)
│   └── images/
│       ├── _DROP_IMAGES_HERE/  Staging — read README inside
│       ├── _placeholders/      Generated SVG placeholders, one per slot
│       ├── heroes/ weddings/ engagements/ elopements/ destination/
│       ├── about/ packages/ testimonials/ blog/ lead-magnet/
└── scripts/
    ├── generate-placeholders.sh   Regenerate SVG placeholders from a slot list
    └── process-images.sh          Optional: batch-resize JPEGs to 3 widths
```

---

## Design tokens at a glance

| Token | Value | Purpose |
|---|---|---|
| `--ink` | `#1a1a1a` | Body text, headings |
| `--paper` | `#faf7f2` | Default surface (warm off-white) |
| `--cream` | `#f3ede2` | Alternating section surface |
| `--blush` | `#e8d5cc` | Soft accent / dividers |
| `--gilt` | `#b8956a` | Antique gold accent — sparingly |
| `--mute` | `#6b6357` | Captions, metadata |

Type: **Cinzel** (display), **Cormorant Garamond** (headings), **Libre Franklin**
(body), **Pinyon Script** (whimsical accents). All loaded from Google Fonts.

Breakpoints: **480 / 768 / 1024 / 1280 / 1600**, mobile-first.

---

## Image workflow

1. Drop raw exports from Pixieset into `/assets/images/_DROP_IMAGES_HERE/`.
   Read the README inside that folder for export settings and naming.
2. Sort each file into the matching destination folder (`heroes/`, `weddings/`, etc.).
3. Optionally run `./scripts/process-images.sh <folder>` to generate
   `-mobile`, `-tablet`, `-desktop` variants in JPEG and WebP.
4. The site references the real path. If the file doesn't exist yet,
   `image-fallback.js` swaps to the matching placeholder SVG.

---

## Build progress

- [x] **Step 1** — Foundation: tokens, type, reset, layout, header/footer partials,
      site.json, image manifest + placeholders, homepage hero responsive at
      320 / 768 / 1280+. Review at `/review.html`.
- [ ] Step 2 — Homepage (full)
- [ ] Step 3 — SVG motif library + preview page
- [ ] Step 4 — Portfolio with masonry + lightbox
- [ ] Step 5 — About, Packages, Contact
- [ ] Step 6 — FAQ, Testimonials, Wedding Guide, Print/Album, Vendors, Blog
- [ ] Step 7 — Lighthouse + a11y audit + Webflow rebuild notes

---

## Open questions

- HoneyBook Smart File embed code — placeholder for now.
- Newsletter platform: assumed **Flodesk** until told otherwise.
- Blog: static placeholder for the prototype; Webflow CMS for production.
- Final logo file: Cinzel wordmark stands in until Shane delivers the real lockup.
