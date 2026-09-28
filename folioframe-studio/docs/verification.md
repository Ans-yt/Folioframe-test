# Verification notes

The build was checked locally with the following bounded pass.

## Automated

- `npm test` — state sanitization, export dimensions, project round trips, malformed project rejection, and undo/redo branching.
- `node --check app.js js/core.js js/artwork.js js/renderer.js` — JavaScript parser checks.
- Playwright smoke pass on Chromium — no console errors on load or after interaction.

## Browser smoke pass

- Default Studio screen renders with OTRA sample.
- Bloom sample, Editorial direction, square ratio, Sage backdrop, and Minimal frame update the preview together.
- PNG export completes from both top-bar and inspector actions.
- `.folio.json` download can be reopened and restores the selected sample, direction, backdrop, ratio, and copy.
- A previously exported PNG can be uploaded and changes the source state to `Imported`.
- Help dialog opens, traps attention visually, returns focus on close, and responds to Escape.
- Mobile navigation opens and closes at 390px; the document has no horizontal overflow.
- Mobile layout stacks preview and preparation rail; desktop keeps the two-column workbench.
- Keyboard shortcuts: undo/redo and Studio/Library/Notes navigation.

## Boundaries

- The browser smoke pass uses fictional samples and a local exported PNG; it does not imply a production usability study.
- No performance, analytics, or cross-browser certification claim is made.
- The project is a static concept build and does not include server-side storage or collaboration.
