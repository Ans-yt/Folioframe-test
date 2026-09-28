# Folioframe Studio

> A private, browser-based proof room for turning website screenshots into portfolio-ready frames.

Folioframe is a small front-end product designed to be **used**, not just viewed. Drop in a screenshot, choose a visual direction, adjust the frame, and export a 2× PNG for a case study, deck, or client conversation. Save the decisions as a portable `.folio.json` file when you want to return later.

![Folioframe Studio wordmark](assets/favicon.svg)

## Why this exists

Creative work often gets presented in one of two ways: a raw screenshot with no context, or a heavily styled mockup that distracts from the work. Folioframe sits between those extremes. The screenshot stays the proof; the frame gives it enough context to travel.

This project is a portfolio piece for an independent front-end designer/creator. It intentionally demonstrates:

- a complete interaction loop rather than a static landing page;
- a custom visual system with responsive states;
- browser-only image handling with no account, upload endpoint, or API key;
- one renderer shared by the live preview, presentation mode, and PNG export;
- honest synthetic examples, clearly labeled rather than presented as client work.

## Features

- **Three editable fictional samples**: OTRA, Bloom, and Form & Field.
- **Bring your own screenshot**: upload, drag and drop, or paste a PNG, JPG, or WebP.
- **Three art directions**: Studio, Editorial, and Spotlight.
- **Three export ratios**: landscape 3:2, square 1:1, and portrait 4:5.
- **Framing controls**: browser/minimal frame, light/dark chrome, scale, radius, depth, and caption.
- **Portable projects**: save/open `.folio.json` with an embedded image only when explicitly saved.
- **History**: undo/redo plus keyboard shortcuts (`⌘/Ctrl Z`, `⌘/Ctrl Shift Z`, `⌘/Ctrl 1–3`).
- **Presentation mode**: inspect the composition without the editor chrome.
- **Accessible states**: semantic buttons, visible focus, live toast messages, labelled controls, reduced motion, and mobile reflow.

## Run it

No build step is required.

### Option 1 — open directly

Open `index.html` in a modern browser. Samples and the editor work without a server.

### Option 2 — serve locally

```bash
npm run serve
# open http://127.0.0.1:4173
```

The project is also ready to publish as a static site with GitHub Pages, Netlify, Vercel static hosting, or any ordinary web server. There are no runtime dependencies.

## Test

The pure state layer has a zero-dependency Node test suite:

```bash
npm test
```

The browser smoke checklist used during the build is in [`docs/verification.md`](docs/verification.md).

## Project shape

```text
.
├── index.html              # accessible product surface
├── styles.css              # tokens, responsive layout, sample site art direction
├── app.js                  # events, persistence, uploads, dialogs, downloads
├── js/
│   ├── core.js             # testable state, validation, history, project format
│   ├── artwork.js          # original fictional sample-site canvas artwork
│   └── renderer.js         # shared 2D canvas export renderer
├── assets/
│   ├── favicon.svg
│   └── fonts/              # self-hosted fonts with license files
├── docs/
│   ├── direction.md        # design direction contract
│   ├── verification.md     # manual and automated checks
│   └── case-study.md       # portfolio-ready project story
├── PRODUCT.md              # product truth and scope
├── DESIGN.md               # shipped visual system
├── LINKEDIN.md             # ready-to-edit launch copy
└── tests/core.test.js      # state and serialization checks
```

## Privacy model

The browser reads image bytes locally so it can render them. No `fetch()` call, analytics script, third-party upload, or external image URL is used by the app. A session restore stores controls only. If you choose **Save .folio**, the downloaded JSON intentionally embeds the image so the project is portable; treat that file as private.

## Honest limits

Folioframe does not scrape a URL, capture another browser tab, generate AI imagery, sync across devices, or claim to be a collaboration product. Those are deliberate boundaries: the repo stays small, inspectable, and deployable as a static site.

## Credits

- Interface, interaction model, fictional sample projects, and original vector artwork: Folioframe Studio, 2026.
- Hanken Grotesk and Bodoni Moda are distributed locally under the SIL Open Font License; see [`assets/fonts/OFL-HankenGrotesk.txt`](assets/fonts/OFL-HankenGrotesk.txt) and [`assets/fonts/OFL-BodoniModa.txt`](assets/fonts/OFL-BodoniModa.txt).
- Licensed under MIT. See [`LICENSE`](LICENSE).
