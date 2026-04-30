# Infinite Love Story

Front-end prototype for **Infinite Love Story**, Shane Drummond's wedding photography brand
covering Florida's Panhandle (30A, Panama City Beach) and destination weddings.

The build is intentionally simple: vanilla HTML, CSS, and JS, no framework, no
package.json. The structure, class names, and section order are designed to
port cleanly to Webflow's Finsweet Client-First system later.

---

## Running locally

```bash
python3 -m http.server 8080
# or:  npx serve .
```

Then open <http://localhost:8080/>.

The site uses a `<base href>` tag on every page, so it works equally well
when served from a domain root (e.g. `infinitelovestory.com/`) or a subpath
(e.g. `reneekiffin.github.io/InfiniteLoveStory/`).

---

## Tech-stack choice

- HTML5, vanilla CSS, vanilla JS. No build step, no npm.
- Shared partials (header, footer, head meta) injected via JS `fetch()` from
  `partials/`. To migrate to PHP includes later, replace each
  `<div data-include="partials/header.html"></div>` with
  `<?php include __DIR__ . '/partials/header.html'; ?>`.
- Editable copy lives in JSON files under `assets/data/` so non-developers
  can update text without touching markup.
- All paths are relative; `<base href="./">` (root) and `<base href="../">`
  (inner pages) anchor them. This makes the site portable across hosts.

---

## File structure

```
/
├── index.html                Homepage
├── 404.html                  GitHub Pages 404
├── review.html               Step-1 review page (hero at 3 breakpoints)
├── pages/                    Inner pages (each declares <base href="../">)
│   ├── portfolio.html
│   ├── about.html
│   ├── packages.html
│   ├── contact.html
│   ├── testimonials.html
│   ├── faq.html
│   ├── wedding-guide.html
│   ├── print-album.html
│   ├── vendors.html
│   ├── blog.html
│   └── blog-post.html
├── partials/
│   ├── meta.html             Shared <head> meta + stylesheet links
│   ├── header.html           Nav + mobile overlay + persistent CTA
│   └── footer.html           Footer with wax-seal mark
├── assets/
│   ├── css/                  reset, tokens, typography, layout, components, pages
│   ├── js/                   include, nav, reveal, carousel, lightbox,
│   │                         portfolio, faq, packages, testimonials-page,
│   │                         contact, blog, homepage, image-fallback, data-loader
│   ├── data/                 site, packages, testimonials, faq, galleries,
│   │                         blog-posts, images (manifest)
│   ├── svg/                  Decorative motifs + preview.html
│   └── images/
│       ├── _DROP_IMAGES_HERE/  Staging — read README inside
│       ├── _placeholders/      Generated SVG placeholders, one per slot
│       ├── heroes/ weddings/ engagements/ elopements/ destination/
│       ├── about/ packages/ blog/ lead-magnet/ featured/
└── scripts/
    ├── generate-placeholders.sh   Regenerate SVG placeholders
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

Type stack:
- **Italiana** — wordmark (placeholder until Shane's logo lands)
- **Cinzel** — eyebrows, small caps display
- **Cormorant Garamond** — headings, italic pull quotes
- **Libre Franklin** — body
- **Pinyon Script** — whimsical accents

Breakpoints: **480 / 768 / 1024 / 1280 / 1600**, mobile-first.

---

## Image workflow

1. Drop raw exports from Pixieset into `assets/images/_DROP_IMAGES_HERE/`.
   Read the README inside that folder for export settings + naming.
2. Sort each file into the matching destination folder.
3. Optionally run `./scripts/process-images.sh <folder>` to generate
   `-mobile`, `-tablet`, `-desktop` variants in JPEG and WebP.
4. The site references the real path. If the file doesn't exist yet,
   `image-fallback.js` swaps to the matching placeholder SVG.

### Featured photos awaiting drop

Three real wedding photos are wired into the homepage layout. Save the
JPEGs at:

```
assets/images/featured/couple-portrait.jpg      ← intimate outdoor couple
assets/images/featured/bridal-lehenga.jpg       ← red & gold bridal portrait
assets/images/featured/reception-bhangra.jpg    ← bhangra dancers mid-leap
```

Single file per slot is fine; the browser scales them.

---

## Integration slots (ready for embed code)

Three integrations are wired but inert until you paste the embed snippet:

- **HoneyBook intake** — `site.json` → `contact.honeybook_smart_file_embed`
  (string of HTML). Renders inside `<div data-honeybook>` on the contact page.
- **Pixieset embed** — `site.json` → `pixieset.embed_html` (string of HTML).
  Renders inside `<div data-pixieset-embed>` on the portfolio page. If empty,
  the page shows a button linking to `pixieset.collection_url`.
- **Newsletter form** — non-functional placeholder forms in the footer and
  on the wedding-guide page; wire to Flodesk by setting the form `action`.

---

## JS module map

| Module | Used by | What it does |
|---|---|---|
| `include.js` | every page | Replaces `[data-include]` with fetched HTML, fires `partials:loaded` |
| `nav.js` | every page | Mobile overlay, transparent-on-hero, scroll-state |
| `image-fallback.js` | every page | Swaps to placeholder SVG on missing image |
| `data-loader.js` | every page | Cached JSON fetcher (`window.ILS.data.load(name)`) |
| `reveal.js` | every page | IntersectionObserver fade-up for `[data-reveal]` |
| `carousel.js` | homepage | Testimonial carousel (autoplay, swipe, dots) |
| `homepage.js` | homepage | Renders packages teaser row |
| `lightbox.js` | portfolio | Custom lightbox (kbd nav, swipe-down dismiss) |
| `portfolio.js` | portfolio | Filter chips + masonry + Pixieset wiring |
| `faq.js` | faq | Accordion with desktop tabs / mobile stacked sections |
| `packages.js` | packages | Renders detail cards from `packages.json` |
| `testimonials-page.js` | testimonials | Full grid renderer |
| `contact.js` | contact | HoneyBook embed slot + tier query pre-fill |
| `blog.js` | blog | Renders the blog index from `blog-posts.json` |

All modules listen for `partials:loaded` so they bind after the header /
footer are injected. All escape HTML to prevent injection from JSON.

---

## Build status

- [x] **Step 1** — Foundation (tokens, type, partials, hero)
- [x] **Step 2** — Homepage (intro, featured grid, story rows, testimonial
      carousel, packages teaser, lead magnet, IG strip, final CTA)
- [x] **Step 3** — SVG motif library + `assets/svg/preview.html`
- [x] **Step 4** — Portfolio with filter chips + masonry + lightbox
- [x] **Step 5** — About, Packages, Contact (HoneyBook slot)
- [x] **Step 6** — FAQ, Testimonials, Wedding Guide, Print/Album, Vendors,
      Blog index, Blog post
- [ ] **Step 7** — Lighthouse + axe audit (deferred until real photos land)

---

## Deploying to GitHub Pages

1. Settings → Pages → Source: "Deploy from a branch" → Branch: `main`,
   folder `/` (root).
2. Wait ~1 minute. URL: `https://<user>.github.io/<repo>/`.
3. Because every page declares `<base href="./">` or `<base href="../">`,
   relative paths resolve correctly under the subpath.
4. The `404.html` at the repo root is served on any unknown URL.

---

## Open items

- HoneyBook Smart File embed code — placeholder for now, paste into
  `site.json` → `contact.honeybook_smart_file_embed`.
- Pixieset embed code — placeholder for now, paste into
  `site.json` → `pixieset.embed_html`.
- Newsletter platform — wire form `action` to Flodesk (or other) when ready.
- Final logo — Italiana wordmark stands in until Shane delivers the lockup.
- Real photographs — the SVG placeholders are clearly labeled for each slot;
  drop the real files into the matching folders.
