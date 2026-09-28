# Folioframe visual system

## Point of view

Folioframe is a daylight gallery-prep desk: the proof is the object on the table, the preparation rail is compact and exact, and the export is the handoff. The visual system is intentionally quieter than the fictional website samples it contains.

## Palette

- `paper` `#F3F4F3` — app ground; daylight working surface.
- `surface` `#FFFFFF` — inspector and controls.
- `ink` `#252933` — primary text and authored UI lines.
- `ink-soft` `#505866` — supporting copy.
- `muted` `#5F6874` — supporting metadata that remains readable on paper and white surfaces.
- `rule` `#DFE2E5` — hairline separation.
- `blue` `#2F4BC9` — action, focus-adjacent state, active selection.
- `blue-soft` `#E8ECFF` — selected-state field.
- `lilac` `#D7D0EF`, `sage` `#D2DDCD`, `sand` `#EEE1CC`, `ink-backdrop` `#252D39` — output fields, never random UI accents.
- `green` `#356B46` — local/private status with small-text contrast.
- `orange` `#DD824B` — synthetic-content indicator and rare notice accent.

The app uses a restrained strategy: neutrals plus cobalt control states; the proof field owns the expressive color.

## Type

- Hanken Grotesk is the working face: compact, open, and legible at control sizes.
- Bodoni Moda appears only in the editorial gesture and fictional sample artwork; it creates a visible change of register rather than a universal serif wash.
- Metadata is small and tracked; no monospace costume is used.

## Layout

- Fixed 226px navigation on wide screens; a slide-in rail under 1100px.
- Desktop workbench: preview column + 320–360px preparation rail.
- Mobile workbench: proof first, controls second; export remains in the sticky top bar.
- Large first-viewport heading is paired with a real interactive proof, not a marketing metric.
- Hairline rules and generous vertical space create the gallery-prep rhythm.

## Components

- `nav-item`: quiet, active cobalt field, readable label.
- `button`: modest 9px radius, no pill-only vocabulary; primary actions are cobalt.
- `choice-button`: thumbnail + explicit name + short purpose.
- `segmented-control`: only for mutually exclusive output format.
- `swatch-button`: color plus visible text, with selected ring.
- `inspector`: sticky white preparation rail on desktop.
- `sample-card`: working sample picker; synthetic content is labeled.
- `toast`: recoverable status, never a blocking error modal.

## Motion and state

One authored feeling carries the product: selecting a direction changes the context around the same proof. Buttons lift by one pixel, cards rise slightly on hover, and toasts enter with a short ease-out. Reduced-motion users receive immediate state changes.

States covered: selected, hover, focus, disabled, imported, unsaved, saved, drag-over, export rendering, malformed upload/project, and empty/unsupported upload recovery.

## Content rules

Sample projects are explicitly fictional. Product copy says what the current build can do; it does not claim capture, AI generation, collaboration, customers, performance, or cloud storage.
