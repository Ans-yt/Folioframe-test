# LinkedIn launch copy

## Short version

I built **Folioframe Studio** — a private, browser-based tool for turning website screenshots into portfolio-ready frames.

The brief was simple: make the artifact do the talking. You can bring a screenshot, choose an art direction, adjust the frame, and export a 2× PNG. Everything runs locally in the browser, with no account, upload endpoint, or API key.

I used plain HTML, CSS, and JavaScript on purpose: static-hosting ready, easy to inspect, and small enough to understand end to end.

The project also includes fictional sample work, a shared preview/export renderer, undo/redo, portable `.folio` projects, keyboard navigation, reduced-motion support, and responsive layouts.

Repo: `github.com/<your-handle>/folioframe-studio`

#frontend #webdesign #uidesign #creativecoding #portfolio

## Longer case-study caption

Most website screenshots are either too raw to present or too decorated to trust.

Folioframe is my answer to that middle ground: a small “proof room” where the screenshot stays central and the frame adds just enough context to make the work travel.

The interesting part was not adding more presets. It was keeping the tool coherent:

- three directions instead of a gallery of interchangeable skins;
- one state model for the live preview, presentation mode, and PNG export;
- no fake client stories or claims;
- privacy by default, with image bytes staying in the tab until a `.folio` project is explicitly saved;
- a real mobile layout instead of a desktop canvas squeezed into a phone.

This is a concept build, not a claim of user research. The next step would be to put it in front of a few independent designers and learn which decisions help the handoff—and which ones feel too opinionated.

## Suggested image sequence

1. The studio screen with the lilac OTRA proof.
2. A square Bloom / Editorial composition.
3. The exported PNG opened by itself.
4. A small crop of the mobile preparation rail.
