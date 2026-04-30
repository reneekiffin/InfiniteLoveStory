# Drop Images Here

> **Featured photos awaiting drop:**
> Three images are wired into the homepage layout but the JPEG files
> haven't been saved yet. Save each at the exact path below and the
> placeholder SVGs will disappear:
>
> | Photo | Save to |
> |---|---|
> | Couple portrait (intimate, outdoor, navy suit + beaded gown) | `assets/images/featured/couple-portrait.jpg` |
> | Bridal lehenga (red & gold, ballroom chandelier) | `assets/images/featured/bridal-lehenga.jpg` |
> | Bhangra dancers (reception celebration, mid-leap) | `assets/images/featured/reception-bhangra.jpg` |
>
> Single file per slot — no responsive variants needed for these three.
> The browser scales them down for smaller screens. If you want maximum
> performance later, run `./scripts/process-images.sh assets/images/featured/`
> and the script will generate -mobile / -tablet / -desktop variants.

---


This is your **staging folder**. The site does **not** read from here. Drop raw exports
from Pixieset (or any other source) into this folder, then sort them into the
appropriate destination folder under `/assets/images/`.

The site reads from named folders:

```
heroes/        weddings/      engagements/   elopements/
destination/   about/         packages/      testimonials/
blog/          lead-magnet/
```

Every image slot the site uses is documented in `/assets/data/images.json`.

---

## 1. Export settings (Pixieset)

When exporting from Shane's Pixieset (`https://shanedrummondphoto.pixieset.com/`):

- **Long edge: 2400 px**
- **Format: JPEG**
- **Quality: 80**
- **Color profile: sRGB**
- **No watermarks**
- Strip metadata if you want — not required.

That gives you the desktop master. The build helper script generates the
`-tablet` (1400 px) and `-mobile` (800 px) variants from it.

---

## 2. Filename convention

Use the slot name from `/assets/data/images.json` as the base, then append the
size suffix and the format extension. Example for the homepage hero:

```
hero-homepage-mobile.jpg     (800 px long edge)
hero-homepage-mobile.webp
hero-homepage-tablet.jpg     (1400 px long edge)
hero-homepage-tablet.webp
hero-homepage-desktop.jpg    (2400 px long edge)
hero-homepage-desktop.webp
```

For galleries with `filename_pattern`, use the pattern with a two-digit index:

```
wedding-01-mobile.jpg
wedding-01-tablet.jpg
wedding-01-desktop.jpg
wedding-02-mobile.jpg
... etc.
```

Then move those files into the matching destination folder
(e.g. `/assets/images/heroes/`).

---

## 3. Generating responsive variants

You have three options:

### Option A — Squoosh (manual, no tools to install)

Drop the desktop master into <https://squoosh.app/>, resize to 1400 px and
800 px long edges, export both JPEG (q80) and WebP (q75). Rename with the
suffix convention above.

### Option B — Build helper script (batch, requires ImageMagick or cwebp)

If you have `magick` (ImageMagick 7) on your machine:

```bash
./scripts/process-images.sh path/to/source/folder
```

It reads every `*.jpg` in the folder, generates `-mobile`, `-tablet`, and
`-desktop` variants in JPEG and WebP, and writes them next to the source.
You then move the generated set into the appropriate destination folder.

The script is **optional**. The site renders fine with just `-desktop.jpg`
files in place — the browser's `srcset` picks the closest match available.

### Option C — Single file fallback

If you drop a single `hero-homepage.jpg` (no size suffix) into
`/assets/images/heroes/`, the page won't find the responsive variants and will
fall back to the placeholder SVG. Either rename it to `hero-homepage-desktop.jpg`
or run Option B to generate the full set.

---

## 4. After dropping files

1. Sort each file into the right destination folder (`heroes/`, `weddings/`, etc.).
2. Hard refresh the site (Cmd/Ctrl + Shift + R).
3. The placeholder SVG disappears and the real photo loads.

If the placeholder still shows, check:

- **Filename matches the slot exactly** — including suffix and extension.
- **Folder matches `images.json`** — e.g. `homepage-feature-weddings` lives in
  `/assets/images/weddings/`, not `/heroes/`.
- **Browser cache** — try an incognito tab.

---

## 5. Where to put new image slots

If you need a new image slot the site doesn't yet know about:

1. Add it to `/assets/data/images.json` with `folder`, `filename`, `aspect`,
   `description`.
2. Add a corresponding row to `scripts/generate-placeholders.sh` and re-run it
   so a placeholder SVG exists.
3. Reference it in the HTML using `data-slot="<your-new-slot>"` so the
   fallback handler picks up the placeholder.
