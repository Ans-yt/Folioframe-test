(function () {
  'use strict';

  const Core = window.FolioCore;
  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));
  const byId = (id) => document.getElementById(id);

  const els = {
    sidebar: byId('sidebar'), mobileMenuButton: byId('mobileMenuButton'),
    saveStatus: byId('saveStatus'), dirtyIndicator: byId('dirtyIndicator'),
    undoButton: byId('undoButton'), redoButton: byId('redoButton'),
    resetButton: byId('resetButton'), exportButton: byId('exportButton'),
    inspectorExportButton: byId('inspectorExportButton'), saveProjectButton: byId('saveProjectButton'),
    projectInput: byId('projectInput'), uploadInput: byId('uploadInput'), uploadCard: byId('uploadCard'),
    stageWrap: byId('stageWrap'), dropHint: byId('dropHint'), compositionCanvas: byId('compositionCanvas'),
    canvasCaption: byId('canvasCaption'), canvasPixelSize: byId('canvasPixelSize'), stageState: byId('stageState'),
    sourceName: byId('sourceName'), sampleGrid: byId('sampleGrid'), titleInput: byId('titleInput'),
    subtitleInput: byId('subtitleInput'), captionToggle: byId('captionToggle'),
    scaleRange: byId('scaleRange'), radiusRange: byId('radiusRange'), shadowRange: byId('shadowRange'),
    scaleOutput: byId('scaleOutput'), radiusOutput: byId('radiusOutput'), shadowOutput: byId('shadowOutput'),
    modalLayer: byId('modalLayer'), modalContent: byId('modalContent'), modalCloseButton: byId('modalCloseButton'),
    presentationLayer: byId('presentationLayer'), presentationStage: byId('presentationStage'),
    closePresentationButton: byId('closePresentationButton'), presentButton: byId('presentButton'),
    toastRegion: byId('toastRegion')
  };

  const SESSION_KEY = 'folioframe:session:v1';
  let state = loadSession();
  let history = Core.createHistory(state);
  let imageAsset = null;
  let projectDirty = false;
  let textEditSnapshot = null;
  let rangeEditSnapshot = null;
  let lastModalTrigger = null;
  let toastCount = 0;

  const MODALS = {
    help: {
      kicker: 'How it works', title: 'A small room for the work.',
      body: 'Folioframe keeps the setup light so the decision can stay visible. Start with a fictional sample or bring a screenshot from your own tab.',
      list: [
        ['1', 'Choose a starting point', 'Pick a sample, paste an image, or drop a PNG, JPG, or WebP onto the preview.'],
        ['2', 'Find the frame', 'Try an art direction, ratio, backdrop, and frame. The proof stays the same while the context changes.'],
        ['3', 'Leave with a file', 'Export a 2× PNG or save a .folio project to reopen the decisions later.']
      ],
      callout: 'Your image bytes never leave this browser tab. A saved .folio file embeds the image only when you explicitly download it.'
    },
    direction: {
      kicker: 'Art direction', title: 'Three ways to let the proof speak.',
      body: 'The presets are intentionally narrow. They create a point of view without making you tune every pixel before you know what the work needs.',
      list: [
        ['A', 'Studio', 'A quiet field with a clear, generous proof. A good default for a case study cover.'],
        ['B', 'Editorial', 'A softer composition with a typographic gesture. Useful when the frame needs a little more voice.'],
        ['C', 'Spotlight', 'Dark, focused, and directional. A strong contrast when the screenshot has a lot to say.']
      ],
      callout: 'The browser preview and the exported PNG use one renderer. What you see is the decision you download.'
    },
    about: {
      kicker: 'About this build', title: 'A portfolio piece with a real job.',
      body: 'Folioframe is a deliberately self-contained front-end project: a useful little tool that makes its design and engineering decisions inspectable.',
      list: [
        ['01', 'No setup', 'Static HTML, CSS, and JavaScript. Open index.html directly or publish the folder to GitHub Pages.'],
        ['02', 'Built to be seen', 'Responsive composition, keyboard shortcuts, accessible controls, reduced motion, and recoverable errors.'],
        ['03', 'Honest by design', 'The sample projects are fictional and labeled synthetic. There is no fake customer proof or cloud claim.']
      ],
      callout: 'Designed and built as an independent front-end creator project · 2026.'
    }
  };

  function loadSession() {
    try {
      const stored = sessionStorage.getItem(SESSION_KEY);
      return stored ? Core.sanitizeState(JSON.parse(stored)) : Core.sanitizeState();
    } catch { return Core.sanitizeState(); }
  }

  function persistSession() {
    try { sessionStorage.setItem(SESSION_KEY, JSON.stringify(Core.sanitizeState(state))); } catch { /* Private storage is optional. */ }
  }

  function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[character]));
  }

  function slugFromFilename(name) {
    return String(name || 'Imported screen').replace(/\.[^.]+$/, '').replace(/[_-]+/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 44) || 'Imported screen';
  }

  function sampleMarkup(sampleKey) {
    if (sampleKey === 'bloom') return '<div class="sample-site bloom"><div class="bloom-top"><span>bloom</span><span>Journal&nbsp;&nbsp; About</span></div><div class="bloom-hero"><div><h4>A little closer to nature.</h4><p>Objects, rituals, and green things for slower days.</p></div><span class="bloom-flower" aria-hidden="true"></span></div></div>';
    if (sampleKey === 'form') return '<div class="sample-site form"><div class="form-top"><span>Form &amp; Field</span><span>Projects&nbsp;&nbsp; Studio</span></div><div class="form-hero"><h4>Space to think differently.</h4><span class="form-block" aria-hidden="true"></span></div><div class="form-foot"><span>Independent architecture</span><span>View work ↗</span></div></div>';
    return '<div class="sample-site otra"><div class="otra-top"><span>OTRA</span><nav><span>Objects</span><span>Journal</span><span>About</span></nav></div><div class="otra-hero"><div><h4>Objects, with intention.</h4><p>Small forms for thoughtful spaces.</p></div><span class="otra-object" aria-hidden="true"></span></div><div class="otra-foot"><span>Collection 01</span><span>Explore ↗</span></div></div>';
  }

  function imageSourceMarkup() {
    if (state.source === 'upload' && imageAsset?.data) return '<div class="sample-site uploaded"><img src="' + imageAsset.data + '" alt="Imported screenshot preview"></div>';
    return sampleMarkup(state.sample);
  }

  function rootCanvasStyle(palette) {
    const chrome = state.chrome === 'dark' ? '#343d4b' : '#fbfcfd';
    const chromeInk = state.chrome === 'dark' ? '#f3f5f7' : '#4d5664';
    return [
      '--canvas-base:' + palette.base,
      '--canvas-ink:' + palette.ink,
      '--proof-scale:' + (state.scale / 100).toFixed(2),
      '--proof-radius:' + state.radius + 'px',
      '--proof-shadow:' + state.shadow,
      '--chrome:' + chrome,
      '--chrome-ink:' + chromeInk,
      '--image-fit:' + state.fit,
      '--image-position:' + state.position + '%'
    ].join(';');
  }

  function previewMarkup(id = 'compositionCanvas') {
    const palette = Core.PALETTES[state.backdrop];
    const ratio = Core.RATIOS[state.ratio];
    const title = escapeHtml(state.title || 'Untitled screen.');
    return '<div class="composition-canvas template-' + state.template + ' palette-' + state.backdrop + '" id="' + id + '" role="img" aria-label="Live composition for ' + title + '" style="' + rootCanvasStyle(palette) + ';aspect-ratio:' + ratio.width + ' / ' + ratio.height + '">' +
      '<canvas class="composition-bitmap" id="' + id + 'Bitmap" aria-hidden="true"></canvas></div>';
  }

  function rendererSource() {
    if (state.source === 'upload') return imageAsset?.image || null;
    return window.FolioArtwork.get(state.sample);
  }

  function paintPreview(canvasId, multiplier = 1) {
    const bitmap = byId(canvasId + 'Bitmap');
    const source = rendererSource();
    if (bitmap && source) window.FolioRenderer.paint(bitmap, state, source, multiplier, imageAsset?.name || 'Imported screenshot');
  }

  function renderCanvas() {
    const current = els.compositionCanvas;
    const wasFocused = document.activeElement;
    current.outerHTML = previewMarkup('compositionCanvas');
    els.compositionCanvas = byId('compositionCanvas');
    paintPreview('compositionCanvas');
    if (document.fonts?.ready) document.fonts.ready.then(() => { if (byId('compositionCanvasBitmap')) paintPreview('compositionCanvas'); });
    if (wasFocused && wasFocused.id === 'titleInput') els.titleInput.focus();
    if (wasFocused && wasFocused.id === 'subtitleInput') els.subtitleInput.focus();
    const ratio = Core.RATIOS[state.ratio];
    els.canvasCaption.textContent = 'Canvas preview · ' + ratio.label.replace('Landscape · ', '').replace('Square · ', '').replace('Portrait · ', '');
    const dimensions = Core.exportDimensions(state.ratio, 2);
    els.canvasPixelSize.textContent = dimensions.width + ' × ' + dimensions.height + ' px';
    els.stageState.textContent = state.source === 'upload' ? 'Imported' : 'Live';
  }

  function renderControls() {
    $$('[data-template]').forEach((button) => {
      const selected = button.dataset.template === state.template;
      button.classList.toggle('is-selected', selected);
      button.setAttribute('aria-pressed', String(selected));
    });
    $$('[data-ratio]').forEach((button) => {
      const selected = button.dataset.ratio === state.ratio;
      button.setAttribute('aria-pressed', String(selected));
    });
    $$('[data-backdrop]').forEach((button) => {
      const selected = button.dataset.backdrop === state.backdrop;
      button.classList.toggle('is-selected', selected);
      button.setAttribute('aria-pressed', String(selected));
    });
    $$('[data-frame]').forEach((button) => {
      const selected = button.dataset.frame === state.frame;
      button.classList.toggle('is-selected', selected);
      button.setAttribute('aria-pressed', String(selected));
    });
    $$('[data-chrome]').forEach((button) => {
      const selected = button.dataset.chrome === state.chrome;
      button.classList.toggle('is-selected', selected);
      button.setAttribute('aria-pressed', String(selected));
    });
    $$('[data-sample]').forEach((button) => {
      const selected = state.source === 'sample' && button.dataset.sample === state.sample;
      button.classList.toggle('is-active', selected);
      button.setAttribute('aria-pressed', String(selected));
    });
    els.scaleRange.value = state.scale; els.scaleOutput.textContent = state.scale + '%';
    els.radiusRange.value = state.radius; els.radiusOutput.textContent = state.radius + ' px';
    els.shadowRange.value = state.shadow; els.shadowOutput.textContent = state.shadow + '%';
    els.titleInput.value = state.title;
    els.subtitleInput.value = state.subtitle;
    els.captionToggle.checked = state.caption;
    els.sourceName.textContent = state.source === 'upload' ? 'Imported' : Core.SAMPLES[state.sample].name;
    els.undoButton.disabled = !history.canUndo;
    els.redoButton.disabled = !history.canRedo;
    els.dirtyIndicator.textContent = projectDirty ? 'Unsaved' : 'Saved';
    els.dirtyIndicator.classList.toggle('is-dirty', projectDirty);
    els.saveStatus.textContent = projectDirty ? 'Unsaved changes' : 'Ready to compose';
  }

  function render() {
    renderCanvas();
    renderControls();
    persistSession();
  }

  function updateState(partial, options = {}) {
    const next = Core.sanitizeState({ ...state, ...partial });
    const changed = JSON.stringify(next) !== JSON.stringify(state);
    if (!changed) return false;
    if (options.record !== false) history.push(next);
    state = next;
    if (options.dirty !== false) projectDirty = true;
    render();
    return true;
  }

  function commitState(partial) {
    return updateState(partial, { record: true, dirty: true });
  }

  function undo() {
    if (!history.canUndo) return;
    state = Core.sanitizeState(history.undo());
    projectDirty = true;
    render();
    showToast('Last decision undone.', 'success', 'History');
  }

  function redo() {
    if (!history.canRedo) return;
    state = Core.sanitizeState(history.redo());
    projectDirty = true;
    render();
    showToast('Decision restored.', 'success', 'History');
  }

  function showToast(message, type = 'success', title = type === 'error' ? 'Something needs attention' : 'Saved locally') {
    const toast = document.createElement('div');
    toast.className = 'toast' + (type === 'error' ? ' is-error' : '');
    toast.dataset.toastId = String(++toastCount);
    toast.innerHTML = '<svg viewBox="0 0 20 20" aria-hidden="true">' + (type === 'error' ? '<path d="M10 3 18 17H2L10 3Z"/><path d="M10 8v4M10 14v.1"/>' : '<circle cx="10" cy="10" r="7.5"/><path d="m6.5 10 2.2 2.2 4.8-5"/>') + '</svg><span><strong>' + escapeHtml(title) + '</strong>' + escapeHtml(message) + '</span>';
    els.toastRegion.appendChild(toast);
    window.setTimeout(() => {
      toast.style.opacity = '0'; toast.style.transform = 'translateY(5px)';
      window.setTimeout(() => toast.remove(), 220);
    }, 4200);
  }

  function openFilePicker() { els.uploadInput.click(); }

  function readAsDataUrl(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.addEventListener('load', () => resolve(String(reader.result)));
      reader.addEventListener('error', () => reject(new Error('The image could not be read. Try another file.')));
      reader.readAsDataURL(file);
    });
  }

  function loadImage(data, name = 'Imported screenshot') {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => {
        try { Core.validateDimensions(image.naturalWidth, image.naturalHeight); } catch (error) { reject(error); return; }
        resolve({ data, name, width: image.naturalWidth, height: image.naturalHeight, image });
      };
      image.onerror = () => reject(new Error('This image could not be decoded. Try another PNG, JPG, or WebP.'));
      image.src = data;
    });
  }

  async function handleImageFile(file) {
    try {
      Core.validateImageFile(file);
      const data = await readAsDataUrl(file);
      const loaded = await loadImage(data, file.name);
      imageAsset = loaded;
      const importedTitle = slugFromFilename(file.name);
      commitState({ source: 'upload', title: importedTitle, subtitle: 'IMPORTED SCREENSHOT / PERSONAL WORK' });
      showToast('Screenshot placed in the proof room.', 'success', 'Image imported');
    } catch (error) {
      showToast(error.message || 'The image could not be imported.', 'error');
    } finally {
      els.uploadInput.value = '';
    }
  }

  async function selectProjectFile(file) {
    if (!file) return;
    try {
      const text = await file.text();
      const project = Core.parseProject(text);
      let loadedImage = null;
      if (project.image?.data) loadedImage = await loadImage(project.image.data, project.image.name);
      imageAsset = loadedImage;
      state = project.state;
      history.reset(state);
      projectDirty = false;
      render();
      showToast('Project reopened with its original decisions.', 'success', 'Project opened');
    } catch (error) {
      showToast(error.message || 'This project could not be opened.', 'error');
    } finally {
      els.projectInput.value = '';
    }
  }

  function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url; link.download = filename; link.rel = 'noopener';
    document.body.appendChild(link); link.click(); link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function downloadText(text, filename, type = 'application/json') {
    downloadBlob(new Blob([text], { type }), filename);
  }

  function saveProject() {
    try {
      const text = Core.serializeProject(state, imageAsset);
      downloadText(text, 'folioframe-' + Core.slug(state.title) + '.folio.json');
      projectDirty = false;
      renderControls();
      showToast('A portable project file is in your downloads.', 'success', 'Project saved');
    } catch (error) {
      showToast(error.message || 'This project could not be saved.', 'error');
    }
  }

  function selectSample(sampleKey) {
    if (!Core.SAMPLES[sampleKey]) return;
    imageAsset = null;
    const sample = Core.SAMPLES[sampleKey];
    commitState({ source: 'sample', sample: sampleKey, title: sample.title, subtitle: sample.subtitle, position: 50, fit: 'cover' });
    showToast(sample.name + ' is ready to compose.', 'success', 'Sample selected');
  }

  function resetStudio() {
    const shouldReset = projectDirty ? window.confirm('Reset the current composition? Your unsaved decisions will be cleared.') : true;
    if (!shouldReset) return;
    imageAsset = null;
    state = Core.sanitizeState();
    history.reset(state);
    projectDirty = false;
    render();
    showToast('Back to the default proof room.', 'success', 'Studio reset');
  }

  function openModal(kind, trigger) {
    const modal = MODALS[kind] || MODALS.help;
    lastModalTrigger = trigger || document.activeElement;
    const list = modal.list.map((item) => '<li><b>' + escapeHtml(item[0]) + '</b><span><strong>' + escapeHtml(item[1]) + '</strong>' + escapeHtml(item[2]) + '</span></li>').join('');
    els.modalContent.innerHTML = '<div class="modal-kicker">' + escapeHtml(modal.kicker) + '</div><h2 id="modalTitle">' + escapeHtml(modal.title) + '</h2><p>' + escapeHtml(modal.body) + '</p><ol class="modal-list">' + list + '</ol><div class="modal-callout"><svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="7.5"/><path d="M10 9v4M10 6.4v.1"/></svg><span>' + escapeHtml(modal.callout) + '</span></div>';
    els.modalLayer.hidden = false;
    document.body.classList.add('modal-open');
    window.setTimeout(() => els.modalCloseButton.focus(), 0);
  }

  function closeModal() {
    els.modalLayer.hidden = true;
    document.body.classList.remove('modal-open');
    if (lastModalTrigger && typeof lastModalTrigger.focus === 'function') lastModalTrigger.focus();
  }

  function openPresentation() {
    els.presentationStage.innerHTML = previewMarkup('presentationCanvas');
    paintPreview('presentationCanvas');
    els.presentationLayer.hidden = false;
    document.body.classList.add('presentation-open');
    els.closePresentationButton.focus();
  }

  function closePresentation() {
    els.presentationLayer.hidden = true;
    document.body.classList.remove('presentation-open');
    els.presentButton.focus();
  }

  function updatePresentationIfOpen() {
    if (!els.presentationLayer.hidden) { els.presentationStage.innerHTML = previewMarkup('presentationCanvas'); paintPreview('presentationCanvas'); }
  }

  async function exportPng() {
    const buttons = [els.exportButton, els.inspectorExportButton];
    buttons.forEach((button) => { button.disabled = true; button.dataset.originalText = button.textContent; button.querySelector('span')?.replaceChildren(document.createTextNode('Rendering…')); });
    els.stageState.textContent = 'Rendering';
    els.saveStatus.textContent = 'Rendering 2× export';
    try {
      if (document.fonts?.ready) await document.fonts.ready;
      const exportCanvas = document.createElement('canvas');
      let sourceImage = imageAsset?.image;
      if (!sourceImage && state.source === 'sample') sourceImage = Core.SAMPLES[state.sample] ? window.FolioArtwork.get(state.sample) : window.FolioArtwork.get('otra');
      if (!sourceImage) throw new Error('Add a screenshot before exporting.');
      window.FolioRenderer.paint(exportCanvas, state, sourceImage, 2, imageAsset?.name || 'Imported screenshot');
      const blob = await new Promise((resolve) => exportCanvas.toBlob(resolve, 'image/png'));
      if (!blob) throw new Error('The PNG could not be created. Try a smaller image or another browser.');
      downloadBlob(blob, 'folioframe-' + Core.slug(state.title) + '.png');
      els.stageState.textContent = 'Live';
      showToast('A 2× PNG is ready in your downloads.', 'success', 'Export complete');
    } catch (error) {
      els.stageState.textContent = state.source === 'upload' ? 'Imported' : 'Live';
      showToast(error.message || 'The PNG could not be exported.', 'error', 'Export failed');
    } finally {
      buttons.forEach((button) => { button.disabled = false; const span = button.querySelector('span'); if (span) span.textContent = 'Export PNG'; });
      renderControls();
    }
  }

  function setRange(key, rawValue, live = false) {
    const value = Number(rawValue);
    if (!Number.isFinite(value)) return;
    updateState({ [key]: value }, { record: !live, dirty: true });
    updatePresentationIfOpen();
  }

  function startRangeEdit() { rangeEditSnapshot = { ...state }; }
  function finishRangeEdit() {
    if (!rangeEditSnapshot) return;
    const changed = JSON.stringify(rangeEditSnapshot) !== JSON.stringify(state);
    if (changed) history.push(state);
    rangeEditSnapshot = null;
    renderControls();
  }

  function startTextEdit() { if (!textEditSnapshot) textEditSnapshot = { ...state }; }
  function finishTextEdit() {
    if (!textEditSnapshot) return;
    if (JSON.stringify(textEditSnapshot) !== JSON.stringify(state)) history.push(state);
    textEditSnapshot = null;
    renderControls();
  }

  function navigate(view) {
    $$('.nav-item').forEach((button) => {
      const active = button.dataset.view === view;
      button.classList.toggle('is-active', active);
      if (active) button.setAttribute('aria-current', 'page'); else button.removeAttribute('aria-current');
    });
    const target = view === 'studio' ? byId('studio') : byId(view);
    target?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
    els.sidebar.classList.remove('is-open'); els.mobileMenuButton.setAttribute('aria-expanded', 'false'); els.mobileMenuButton.setAttribute('aria-label', 'Open navigation');
    if (window.innerWidth <= 1100) els.mobileMenuButton.focus();
  }

  function toggleSidebar() {
    const open = els.sidebar.classList.toggle('is-open');
    els.mobileMenuButton.setAttribute('aria-expanded', String(open));
    els.mobileMenuButton.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  }

  function bindEvents() {
    $$('.nav-item').forEach((button) => button.addEventListener('click', () => navigate(button.dataset.view)));
    $$('[data-template]').forEach((button) => button.addEventListener('click', () => commitState({ template: button.dataset.template })));
    $$('[data-ratio]').forEach((button) => button.addEventListener('click', () => commitState({ ratio: button.dataset.ratio })));
    $$('[data-backdrop]').forEach((button) => button.addEventListener('click', () => commitState({ backdrop: button.dataset.backdrop })));
    $$('[data-frame]').forEach((button) => button.addEventListener('click', () => commitState({ frame: button.dataset.frame })));
    $$('[data-chrome]').forEach((button) => button.addEventListener('click', () => commitState({ chrome: button.dataset.chrome })));
    $$('[data-sample]').forEach((button) => button.addEventListener('click', () => selectSample(button.dataset.sample)));
    $$('[data-modal]').forEach((button) => button.addEventListener('click', () => openModal(button.dataset.modal, button)));

    els.mobileMenuButton.addEventListener('click', toggleSidebar);
    els.undoButton.addEventListener('click', undo); els.redoButton.addEventListener('click', redo);
    els.resetButton.addEventListener('click', resetStudio);
    els.exportButton.addEventListener('click', exportPng); els.inspectorExportButton.addEventListener('click', exportPng);
    els.saveProjectButton.addEventListener('click', saveProject);
    els.projectInput.addEventListener('change', () => selectProjectFile(els.projectInput.files?.[0]));
    els.uploadInput.addEventListener('change', () => handleImageFile(els.uploadInput.files?.[0]));
    els.uploadCard.addEventListener('click', openFilePicker);
    els.presentButton.addEventListener('click', openPresentation); els.closePresentationButton.addEventListener('click', closePresentation);
    els.modalCloseButton.addEventListener('click', closeModal);
    $('[data-close-modal]', els.modalLayer).addEventListener('click', closeModal);

    const ranges = [[els.scaleRange, 'scale'], [els.radiusRange, 'radius'], [els.shadowRange, 'shadow']];
    ranges.forEach(([input, key]) => {
      input.addEventListener('pointerdown', startRangeEdit); input.addEventListener('focus', startRangeEdit);
      input.addEventListener('input', () => setRange(key, input.value, true));
      input.addEventListener('change', finishRangeEdit); input.addEventListener('blur', finishRangeEdit);
    });
    [[els.titleInput, 'title'], [els.subtitleInput, 'subtitle']].forEach(([input, key]) => {
      input.addEventListener('focus', startTextEdit);
      input.addEventListener('input', () => updateState({ [key]: input.value }, { record: false, dirty: true }));
      input.addEventListener('blur', finishTextEdit);
      input.addEventListener('keydown', (event) => { if (event.key === 'Enter') input.blur(); });
    });
    els.captionToggle.addEventListener('change', () => commitState({ caption: els.captionToggle.checked }));

    ['dragenter', 'dragover'].forEach((eventName) => els.stageWrap.addEventListener(eventName, (event) => {
      event.preventDefault(); event.stopPropagation(); els.stageWrap.classList.add('is-dragging');
    }));
    ['dragleave', 'drop'].forEach((eventName) => els.stageWrap.addEventListener(eventName, (event) => {
      event.preventDefault(); event.stopPropagation();
      if (eventName === 'dragleave' && event.relatedTarget && els.stageWrap.contains(event.relatedTarget)) return;
      els.stageWrap.classList.remove('is-dragging');
    }));
    els.stageWrap.addEventListener('drop', (event) => {
      const file = Array.from(event.dataTransfer?.files || []).find((candidate) => candidate.type.startsWith('image/'));
      if (file) handleImageFile(file); else showToast('Drop a PNG, JPG, or WebP image to place it.', 'error');
    });
    document.addEventListener('paste', (event) => {
      const file = Array.from(event.clipboardData?.files || []).find((candidate) => candidate.type.startsWith('image/'));
      if (file) { event.preventDefault(); handleImageFile(file); }
    });
    document.addEventListener('keydown', (event) => {
      const modifier = event.metaKey || event.ctrlKey;
      if (event.key === 'Escape') {
        if (!els.modalLayer.hidden) closeModal(); else if (!els.presentationLayer.hidden) closePresentation();
      }
      if (modifier && event.key.toLowerCase() === 'z') { event.preventDefault(); event.shiftKey ? redo() : undo(); }
      if (modifier && event.key.toLowerCase() === 'y') { event.preventDefault(); redo(); }
      if (modifier && event.key === '1') { event.preventDefault(); navigate('studio'); }
      if (modifier && event.key === '2') { event.preventDefault(); navigate('library'); }
      if (modifier && event.key === '3') { event.preventDefault(); navigate('notes'); }
    });
    window.addEventListener('resize', () => { if (window.innerWidth > 1100) { els.sidebar.classList.remove('is-open'); els.mobileMenuButton.setAttribute('aria-expanded', 'false'); } });
  }

  bindEvents();
  render();
})();
