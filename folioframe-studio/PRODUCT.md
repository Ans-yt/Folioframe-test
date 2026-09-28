# Folioframe Studio

<!-- impeccable:product-schema 1 -->

## Platform
web

## Stack
Confirmed: static HTML, CSS, and JavaScript. The user chose code-first implementation. No build step, framework, account, API key, or backend is required to use the deliverable.

## Users
Confirmed portfolio audience: creative clients evaluating a front-end designer/creator. The user delegated naming, product concept, and end-to-end implementation.

Chosen product audience: independent designers and small studios who need to present website work clearly in a portfolio, client deck, or social post. This is a product decision, not evidence from user research.

## Product Purpose
Turn a website screenshot into a composed, high-resolution portfolio image in a browser. The artifact should demonstrate product judgment, original visual direction, accessible interactions, and functioning front-end engineering rather than only a landing-page mockup.

## Positioning
One focused presentation workspace: bring a screenshot, choose an art direction, adjust the frame and typography, then export a PNG. The preview and export use the same renderer. All processing stays in the browser.

## Operating Context
Primary: a designer on a laptop preparing a case study or client presentation. Secondary: reviewing or exporting a composition on a phone. Static hosting and opening index.html directly are supported. First-run examples must work without uploading anything.

## Capabilities and Constraints
- Shipped scope: three original editable example websites; local PNG/JPEG/WebP upload and paste/drop; browser/minimal frames; 3 composition presets; 3 canvas ratios; 4 backgrounds; editable title and project label; scale, corner radius, shadow, and light/dark browser chrome; undo/redo; session settings; PNG export; save/open a portable .folio.json project.
- No AI generation, collaboration, arbitrary website scraping, screenshot capture, URL fetching, or cloud storage. Avoid presenting these as available.
- User images are transient until explicitly saved in a project download. Session restoration stores controls only, not uploaded image bytes.
- File size, format, dimensions, and project schema are validated. Export errors must be recoverable.
- Original illustrative website samples are fictional. No invented client relationships, research, testimonials, performance gains, or adoption claims.

## Accessibility & Inclusion
Implementation target: semantic controls, visible focus, labels, keyboard navigation, live status messages, reduced-motion support, responsive reflow, and UI text contrast. This is a target, not a certification.

## Product Principles
1. The working artifact is the proof.
2. Give users a useful result before asking for assets.
3. Make the private path the default, with no external runtime requests.
4. Keep the output honest: no fake customer, AI, or platform claims.
5. Keep setup and handoff small enough for another designer to understand.
