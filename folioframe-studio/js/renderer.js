/* One canvas painter for preview, presentation, and lossless PNG export. */
(function () {
  'use strict';
  const C = window.FolioCore;
  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath(); ctx.roundRect(x, y, w, h, Math.min(r, w / 2, h / 2));
  }
  function fitText(ctx, text, maxWidth, maxSize, weight = 600, family = 'Hanken Grotesk') {
    let size = maxSize;
    ctx.font = `${weight} ${size}px "${family}"`;
    while (size > 10 && ctx.measureText(text).width > maxWidth) {
      size--; ctx.font = `${weight} ${size}px "${family}"`;
    }
    return size;
  }
  function wrapped(ctx, value, x, y, maxWidth, size, maxLines = 3, family = 'Hanken Grotesk') {
    // Break long tokens as well as spaces so pasted URLs cannot spill off-canvas.
    const chars = Array.from(value); const lines = []; let line = '';
    ctx.font = `600 ${size}px "${family}"`;
    for (const char of chars) {
      if (line && ctx.measureText(line + char).width > maxWidth) { lines.push(line.trim()); line = ''; }
      line += char;
    }
    if (line) lines.push(line.trim());
    if (lines.length > maxLines && size > 13) return wrapped(ctx, value, x, y, maxWidth, size - 2, maxLines, family);
    lines.slice(0, maxLines).forEach((s, i) => ctx.fillText(s, x, y + i * size * 1.1));
  }
  function drawImage(ctx, image, x, y, w, h, fit, position) {
    const iw = image.naturalWidth || image.width; const ih = image.naturalHeight || image.height;
    const scale = fit === 'contain' ? Math.min(w / iw, h / ih) : Math.max(w / iw, h / ih);
    const dw = iw * scale; const dh = ih * scale;
    ctx.save(); ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip();
    ctx.fillStyle = '#f4f4f1'; ctx.fillRect(x, y, w, h);
    ctx.drawImage(image, x + (w - dw) / 2, y + (h - dh) * position / 100, dw, dh); ctx.restore();
  }

  function frame(ctx, state, image, box, url) {
    const { x, y, w, h } = box;
    const bar = state.frame === 'browser' ? w * .037 : 0;
    const radius = state.radius * w / 1050;
    ctx.save();
    ctx.shadowColor = `rgba(24,20,40,${state.shadow / 155})`;
    ctx.shadowBlur = state.shadow * .9; ctx.shadowOffsetY = state.shadow * .52;
    roundRect(ctx, x, y, w, h, radius); ctx.fillStyle = '#fff'; ctx.fill();
    ctx.shadowColor = 'transparent'; ctx.shadowBlur = 0; ctx.shadowOffsetY = 0;
    roundRect(ctx, x, y, w, h, radius); ctx.clip();
    drawImage(ctx, image, x, y + bar, w, h - bar, state.fit, state.position);
    if (bar) {
      const dark = state.chrome === 'dark';
      ctx.fillStyle = dark ? '#30343e' : '#f9f9fb'; ctx.fillRect(x, y, w, bar);
      ['#db9691', '#d4bd85', '#98b4a1'].forEach((color, i) => {
        ctx.beginPath(); ctx.arc(x + bar * .5 + i * bar * .36, y + bar / 2, bar * .092, 0, Math.PI * 2);
        ctx.fillStyle = color; ctx.fill();
      });
      roundRect(ctx, x + w * .3, y + bar * .2, w * .4, bar * .6, 4); ctx.fillStyle = dark ? '#454955' : '#ededf1'; ctx.fill();
      ctx.fillStyle = dark ? '#f0f0f4' : '#666975'; ctx.textAlign = 'center';
      fitText(ctx, url, w * .35, bar * .29, 500); ctx.fillText(url, x + w / 2, y + bar * .6);
      ctx.textAlign = 'left';
      ctx.strokeStyle = dark ? '#555c69' : '#dddde3'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(x, y + bar); ctx.lineTo(x + w, y + bar); ctx.stroke();
    }
    ctx.restore();
    roundRect(ctx, x, y, w, h, radius); ctx.strokeStyle = 'rgba(36,31,47,.12)'; ctx.lineWidth = 1; ctx.stroke();
  }

  function paint(canvas, state, image, multiplier = 1, sourceName = '') {
    const size = C.RATIOS[state.ratio]; const W = size.width; const H = size.height;
    canvas.width = W * multiplier; canvas.height = H * multiplier;
    const ctx = canvas.getContext('2d'); ctx.scale(multiplier, multiplier);
    ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = 'high';
    const p = C.PALETTES[state.backdrop]; ctx.fillStyle = p.base; ctx.fillRect(0, 0, W, H);
    const m = W * .068; const wide = state.ratio === 'landscape';
    let maxW = W * .86; let maxH = H * (state.caption ? .72 : .86);
    let cx = W / 2; let cy = H * (state.caption ? .565 : .5);
    if (state.template === 'editorial' && wide && state.caption) {
      maxW = W * .6; maxH = H * .79; cx = W * .658; cy = H * .52;
      ctx.fillStyle = p.detail; ctx.fillRect(W * .415, 0, W * .585, H);
    } else if (state.template === 'editorial') {
      ctx.fillStyle = p.detail; ctx.fillRect(W * .05, H * .31, W * .9, H * .64);
    }
    if (state.template === 'spotlight') {
      maxW = W * .92; maxH = H * (state.caption ? .72 : .86); cy = H * (state.caption ? .438 : .5);
      ctx.strokeStyle = p.detail; ctx.lineWidth = 1.5; ctx.strokeRect(m * .54, m * .54, W - m * 1.08, H - m * 1.08);
    }
    const barRatio = state.frame === 'browser' ? .037 : 0;
    const fw = Math.min(maxW, maxH / (.625 + barRatio)) * state.scale / 94;
    const fh = fw * (.625 + barRatio);
    const box = { x: cx - fw / 2, y: cy - fh / 2, w: fw, h: fh };
    frame(ctx, state, image, box, state.source === 'sample' ? C.SAMPLES[state.sample].url : sourceName || 'Your work, in focus');
    if (state.caption) {
      ctx.fillStyle = p.ink;
      if (state.template === 'editorial' && wide) {
        fitText(ctx, state.subtitle, W * .29, 14, 600); ctx.fillText(state.subtitle, m, H * .13);
        wrapped(ctx, state.title, m, H * .37, W * .28, 64, 5, 'Bodoni Moda');
        ctx.strokeStyle = p.ink; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(m, H * .81); ctx.lineTo(m + W * .085, H * .81); ctx.stroke();
      } else if (state.template === 'spotlight') {
        fitText(ctx, state.title, W - m * 2, W * .048, 600); ctx.fillText(state.title, m, H * .86);
        fitText(ctx, state.subtitle, W - m * 2, W * .012, 500); ctx.fillText(state.subtitle, m, H * .91);
      } else {
        fitText(ctx, state.subtitle, W - m * 2, W * .0115, 600); ctx.fillText(state.subtitle, m, H * .084);
        fitText(ctx, state.title, W - m * 2, W * .044, 600, state.template === 'editorial' ? 'Bodoni Moda' : 'Hanken Grotesk');
        ctx.fillText(state.title, m, H * .153);
      }
    }
    return canvas;
  }
  window.FolioRenderer = { paint };
})();
