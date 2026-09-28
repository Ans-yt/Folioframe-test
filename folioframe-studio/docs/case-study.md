# Folioframe Studio — portfolio case study

## The idea

Folioframe is a small tool for a common creative handoff: presenting a website screenshot in a way that adds context without overpowering the work.

The concept deliberately avoids the familiar “portfolio builder dashboard” pattern. Instead, it behaves like a daylight gallery-prep desk: a large proof sits in the center, the preparation rail stays narrow, and the output is always visible.

## The problem

A raw browser screenshot is often too literal for a case study cover. A heavy mockup can be too decorative. The designer needs a fast middle ground that feels considered, keeps the screenshot legible, and produces something they can actually send.

## Product decision

The core loop is one sentence:

> Bring a screenshot, choose a frame, export the proof.

Three art directions are enough to offer a point of view while keeping the tool decisive. The same state drives the DOM preview and the export renderer, so the downloaded PNG does not drift from the interface.

## Visual direction

The interface uses a paper-white workspace, ink typography, cobalt controls, and a lilac proof field. The proof carries the expressive color; the UI stays quiet. Hanken Grotesk handles the working interface, while Bodoni Moda gives the sample artwork and editorial option a more physical, printed voice.

The product avoids a generic SaaS dashboard: no oversized metric hero, no nested card maze, no gradients, and no invented customer claims. The signature moment is the screenshot changing context while its content stays stable.

## Engineering decisions

### Static by default

Plain HTML, CSS, and JavaScript make the repo GitHub Pages-ready and easy for a client to inspect. There is no bundler, framework, cloud service, account flow, or runtime dependency.

### One renderer, three surfaces

`js/renderer.js` paints the export canvas. The preview and presentation mode are composed from the same state model, while the PNG renderer draws the equivalent layout at 2×. This keeps the export boundary explicit and testable.

### Privacy as a product behavior

Uploads are held in memory. Controls persist to `sessionStorage`; image bytes do not. A `.folio.json` project embeds an image only when the person chooses to download the project. Invalid file types, oversized images, malformed projects, and undecodable images all produce a recoverable message.

### Original synthetic content

The three sample websites are fictional and marked synthetic. Their artwork is drawn locally on a canvas—no stock imagery or client proof is implied.

## What I would measure next

This is a concept build, so the following are hypotheses rather than results:

- Can a first-time visitor export a useful frame without reading instructions?
- Which art direction gets selected most often for case study covers?
- Does saving a `.folio` project make repeat use feel worthwhile?
- Where does the experience become too opinionated for real client work?

## Next iteration

The next honest step would be a small usability round with independent designers, followed by one or two additional output options based on observed needs—not a larger preset gallery by default.
