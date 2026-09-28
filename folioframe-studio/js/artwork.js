/* Original fictional websites and illustrations; no fetched images. */
(function () {
  'use strict';
  const cache = new Map();
  function text(ctx, value, x, y, size, color, weight = 500, family = 'Hanken Grotesk') {
    ctx.fillStyle = color; ctx.font = `${weight} ${size}px "${family}"`;
    ctx.fillText(value, x, y);
  }
  function rect(ctx, x, y, w, h, color) { ctx.fillStyle = color; ctx.fillRect(x, y, w, h); }
  function line(ctx, x1, y1, x2, y2, color, width = 1) {
    ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.strokeStyle = color; ctx.lineWidth = width; ctx.stroke();
  }
  function ellipse(ctx, x, y, rx, ry, fill) {
    ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2); ctx.fillStyle = fill; ctx.fill();
  }
  function arrow(ctx, x, y, size, color) {
    line(ctx, x, y + size, x + size, y, color, 2);
    line(ctx, x, y, x + size, y, color, 2);
    line(ctx, x + size, y, x + size, y + size, color, 2);
  }

  function stillLife(ctx, x, y, w, h) {
    ctx.save(); ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip(); ctx.translate(x, y); ctx.scale(w / 630, h / 640);
    const wall = ctx.createLinearGradient(0, 0, 630, 640);
    wall.addColorStop(0, '#e6d9bf'); wall.addColorStop(1, '#c4b59d');
    rect(ctx, 0, 0, 630, 640, wall);
    rect(ctx, 0, 476, 630, 164, '#cbbda5');
    ctx.save(); ctx.filter = 'blur(16px)'; ellipse(ctx, 327, 525, 221, 37, '#ab9a80'); ctx.restore();
    // A mushroom lamp: lathed surfaces, cast shadows, and a real ellipsoidal shade.
    const stem = ctx.createLinearGradient(174, 0, 285, 0);
    stem.addColorStop(0, '#c65535'); stem.addColorStop(.42, '#e4825b'); stem.addColorStop(1, '#a53d2a');
    ctx.beginPath(); ctx.moveTo(199, 265); ctx.lineTo(269, 265); ctx.lineTo(289, 501);
    ctx.bezierCurveTo(280, 524, 184, 524, 176, 501); ctx.closePath(); ctx.fillStyle = stem; ctx.fill();
    ellipse(ctx, 233, 501, 57, 15, '#b74b30');
    const shade = ctx.createLinearGradient(95, 170, 350, 326);
    shade.addColorStop(0, '#f2a27e'); shade.addColorStop(.6, '#d96642'); shade.addColorStop(1, '#ab3c29');
    ctx.beginPath(); ctx.moveTo(89, 302); ctx.bezierCurveTo(93, 101, 379, 100, 386, 302);
    ctx.bezierCurveTo(318, 340, 151, 340, 89, 302); ctx.fillStyle = shade; ctx.fill();
    ellipse(ctx, 237, 304, 148, 27, '#af432e');
    ellipse(ctx, 237, 305, 134, 18, '#ed9866');
    // Glazed vessel beside the lamp, constructed with a continuous contour.
    const glaze = ctx.createLinearGradient(366, 0, 512, 0);
    glaze.addColorStop(0, '#738571'); glaze.addColorStop(.32, '#acb8a1'); glaze.addColorStop(.7, '#7c8c73'); glaze.addColorStop(1, '#56674f');
    ctx.beginPath(); ctx.moveTo(403, 334); ctx.bezierCurveTo(418, 370, 365, 389, 372, 453);
    ctx.bezierCurveTo(378, 509, 487, 526, 510, 463); ctx.bezierCurveTo(535, 396, 476, 374, 482, 334);
    ctx.closePath(); ctx.fillStyle = glaze; ctx.fill();
    ellipse(ctx, 442, 334, 40, 11, '#c0cbb3'); ellipse(ctx, 442, 334, 30, 6, '#4f604b');
    // A folded studio sheet adds a sharper, small-scale material.
    ctx.beginPath(); ctx.moveTo(299, 543); ctx.lineTo(412, 509); ctx.lineTo(537, 534); ctx.lineTo(424, 574); ctx.closePath(); ctx.fillStyle = '#ece6d7'; ctx.fill();
    line(ctx, 355, 531, 479, 555, '#c3bbaa', 2);
    ctx.restore();
  }

  function otra(ctx) {
    rect(ctx, 0, 0, 1440, 900, '#f5f4ed');
    text(ctx, 'OTRA', 62, 74, 36, '#263a2b', 800);
    text(ctx, 'Objects', 804, 67, 16, '#263a2b'); text(ctx, 'Our philosophy', 916, 67, 16, '#263a2b');
    text(ctx, 'Journal', 1086, 67, 16, '#263a2b'); text(ctx, 'Bag (0)', 1292, 67, 16, '#263a2b');
    line(ctx, 62, 104, 1378, 104, '#d3d6c9');
    text(ctx, 'Less, but with feeling.', 66, 226, 19, '#64705f');
    text(ctx, 'Objects for', 59, 338, 88, '#263a2b', 500, 'Bodoni Moda');
    text(ctx, 'a slower', 59, 437, 88, '#263a2b', 500, 'Bodoni Moda');
    text(ctx, 'everyday.', 59, 536, 88, '#263a2b', 500, 'Bodoni Moda');
    text(ctx, 'Considered forms. Natural materials.', 64, 611, 20, '#64705f');
    text(ctx, 'A few good things, made to stay.', 64, 642, 20, '#64705f');
    rect(ctx, 64, 689, 260, 57, '#283e2d'); text(ctx, 'Explore the collection', 88, 725, 17, '#fbfbf4'); arrow(ctx, 289, 709, 12, '#fbfbf4');
    stillLife(ctx, 726, 143, 652, 632);
    text(ctx, 'THE EVERYDAY COLLECTION', 728, 813, 13, '#48523e', 600);
    text(ctx, 'Form, function, a little feeling.', 1022, 813, 15, '#59634f');
    line(ctx, 62, 847, 1378, 847, '#d3d6c9');
    text(ctx, 'Objects to live with. Not just look at.', 64, 878, 14, '#64705f'); text(ctx, 'A fictional design study', 1204, 878, 13, '#64705f');
  }

  function flower(ctx, x, y, r, color, angle) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(angle);
    for (let i = 0; i < 7; i++) {
      ctx.rotate(Math.PI * 2 / 7);
      const petal = ctx.createLinearGradient(0, 0, 0, -r);
      petal.addColorStop(0, '#9d5b35'); petal.addColorStop(.45, color); petal.addColorStop(1, '#f4bb89');
      ctx.beginPath(); ctx.moveTo(-9, 0); ctx.bezierCurveTo(-r * .85, -r * .18, -r * .47, -r * 1.25, 2, -r);
      ctx.bezierCurveTo(r * .62, -r * 1.14, r * .65, -r * .25, 9, 0); ctx.fillStyle = petal; ctx.fill();
    }
    ellipse(ctx, 0, 0, r * .18, r * .18, '#674227');
    for (let i = 0; i < 22; i++) {
      const a = i * 2.4; const d = r * .13 * Math.sqrt(i / 22);
      ellipse(ctx, Math.cos(a) * d, Math.sin(a) * d, 2, 2, '#cfa951');
    }
    ctx.restore();
  }
  function bloom(ctx) {
    rect(ctx, 0, 0, 1440, 900, '#faeee0'); rect(ctx, 830, 0, 610, 900, '#e7b9a3');
    text(ctx, 'bloom', 64, 88, 56, '#553e35', 500, 'Bodoni Moda');
    text(ctx, 'Flowers, thoughtfully.', 295, 78, 15, '#755c51');
    text(ctx, 'The atelier', 974, 76, 17, '#553e35'); text(ctx, 'Get in touch', 1197, 76, 17, '#553e35');
    text(ctx, 'A little wild.', 61, 344, 101, '#553e35', 500, 'Bodoni Moda');
    text(ctx, 'A lot of feeling.', 61, 459, 101, '#553e35', 500, 'Bodoni Moda');
    text(ctx, 'Seasonal stems and unexpected arrangements,', 66, 544, 22, '#755c51');
    text(ctx, 'for the days worth remembering.', 66, 580, 22, '#755c51');
    line(ctx, 67, 671, 305, 671, '#553e35'); text(ctx, 'Meet your next bouquet', 67, 655, 19, '#553e35'); arrow(ctx, 338, 638, 18, '#553e35');
    ctx.save(); ctx.lineWidth = 7; ctx.strokeStyle = '#536b47';
    for (const [x, y] of [[1060, 332], [1202, 388], [978, 497]]) {
      ctx.beginPath(); ctx.moveTo(1114, 823); ctx.bezierCurveTo(1115, 648, x + 70, 490, x, y); ctx.stroke();
    }
    ctx.translate(1112, 649); ctx.rotate(-.65); ctx.beginPath(); ctx.moveTo(0, 0); ctx.bezierCurveTo(-104, -153, -146, -9, 0, 0); ctx.fillStyle = '#667849'; ctx.fill();
    ctx.restore();
    flower(ctx, 1060, 331, 107, '#ce7758', -.25); flower(ctx, 1201, 390, 94, '#ed986b', .15); flower(ctx, 977, 497, 83, '#d78d59', .5);
    text(ctx, 'Made with the season. Never against it.', 66, 837, 18, '#755c51');
    text(ctx, 'A fictional botanical atelier', 990, 865, 14, '#553e35');
  }
  function architecture(ctx) {
    rect(ctx, 0, 0, 1440, 900, '#e4e8eb');
    text(ctx, 'FORM & FIELD', 61, 71, 27, '#263439', 700);
    text(ctx, 'Architecture / Interiors / Place', 634, 67, 16, '#526266'); text(ctx, 'Selected work', 1220, 67, 17, '#263439');
    line(ctx, 62, 106, 1378, 106, '#b5c1c7');
    rect(ctx, 63, 149, 922, 592, '#bccbd4');
    // A rendered sectional pavilion, not a stock photo or external asset.
    rect(ctx, 63, 589, 922, 152, '#9faba2');
    ctx.beginPath(); ctx.moveTo(209, 284); ctx.lineTo(679, 208); ctx.lineTo(878, 306); ctx.lineTo(405, 392); ctx.closePath(); ctx.fillStyle = '#dbd7c9'; ctx.fill();
    ctx.beginPath(); ctx.moveTo(209, 284); ctx.lineTo(405, 392); ctx.lineTo(405, 617); ctx.lineTo(209, 498); ctx.closePath(); ctx.fillStyle = '#bab6a9'; ctx.fill();
    ctx.beginPath(); ctx.moveTo(405, 392); ctx.lineTo(878, 306); ctx.lineTo(878, 522); ctx.lineTo(405, 617); ctx.closePath(); ctx.fillStyle = '#737f79'; ctx.fill();
    for (let i = 0; i < 11; i++) line(ctx, 427 + i * 41, 389 - i * 7.4, 427 + i * 41, 608 - i * 8.1, '#c4c3b4', 7);
    line(ctx, 408, 594, 878, 503, '#495f57', 20);
    text(ctx, 'Built around', 1038, 223, 38, '#263439', 500); text(ctx, 'the way', 1038, 270, 38, '#263439', 500); text(ctx, 'we live.', 1038, 317, 38, '#263439', 500);
    text(ctx, 'Space that leaves room', 1038, 501, 18, '#526266'); text(ctx, 'for possibility.', 1038, 531, 18, '#526266');
    arrow(ctx, 1038, 669, 33, '#263439');
    text(ctx, 'The courtyard house', 63, 795, 24, '#263439'); text(ctx, 'Residential concept / 2026', 705, 793, 17, '#526266');
    line(ctx, 63, 825, 1378, 825, '#b5c1c7'); text(ctx, 'Thoughtful spaces. Lasting relationships.', 63, 872, 18, '#526266'); text(ctx, 'Fictional design study', 1215, 872, 14, '#526266');
  }
  function get(key) {
    if (cache.has(key)) return cache.get(key);
    const canvas = document.createElement('canvas'); canvas.width = 1440; canvas.height = 900;
    const ctx = canvas.getContext('2d');
    ({ otra, bloom, form: architecture }[key] || otra)(ctx);
    cache.set(key, canvas); return canvas;
  }
  window.FolioArtwork = { get, clear: () => cache.clear() };
})();
