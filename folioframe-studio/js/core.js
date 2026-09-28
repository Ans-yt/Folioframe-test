/* Pure state and validation. Shared by the browser and Node's test runner. */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.FolioCore = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  const RATIOS = Object.freeze({
    landscape: { width: 1440, height: 960, label: 'Landscape · 3:2' },
    square: { width: 1200, height: 1200, label: 'Square · 1:1' },
    portrait: { width: 1080, height: 1350, label: 'Portrait · 4:5' }
  });
  const PALETTES = Object.freeze({
    lilac: { base: '#d7d0ef', ink: '#302843', detail: '#bbb0df', label: 'Lilac' },
    sage: { base: '#d2ddcd', ink: '#28372b', detail: '#b5c6ac', label: 'Sage' },
    sand: { base: '#eee1cc', ink: '#493924', detail: '#d9c7a9', label: 'Sand' },
    ink: { base: '#252d39', ink: '#f4f3ed', detail: '#414d5f', label: 'Ink' }
  });
  const SAMPLES = Object.freeze({
    otra: { name: 'OTRA', category: 'Objects & interiors', title: 'Objects, with intention.', subtitle: 'OTRA / WEB DESIGN CONCEPT', url: 'otra.example' },
    bloom: { name: 'Bloom', category: 'Botanical atelier', title: 'A little closer to nature.', subtitle: 'BLOOM / BRAND & WEB CONCEPT', url: 'bloom.example' },
    form: { name: 'Form & Field', category: 'Independent architecture', title: 'Space to think differently.', subtitle: 'FORM & FIELD / WEB CONCEPT', url: 'formandfield.example' }
  });
  const DEFAULTS = Object.freeze({
    template: 'studio', ratio: 'landscape', backdrop: 'lilac', frame: 'browser',
    chrome: 'light', sample: 'otra', source: 'sample', title: SAMPLES.otra.title,
    subtitle: SAMPLES.otra.subtitle, scale: 84, radius: 14, shadow: 38,
    caption: true, fit: 'cover', position: 50
  });
  const ENUMS = {
    template: ['studio', 'editorial', 'spotlight'], ratio: Object.keys(RATIOS),
    backdrop: Object.keys(PALETTES), frame: ['browser', 'minimal'],
    chrome: ['light', 'dark'], sample: Object.keys(SAMPLES),
    source: ['sample', 'upload'], fit: ['contain', 'cover']
  };
  const LIMITS = { scale: [58, 94], radius: [0, 32], shadow: [0, 70], position: [0, 100] };
  const MAX_FILE_BYTES = 12 * 1024 * 1024;
  const MAX_PROJECT_BYTES = 18 * 1024 * 1024;
  const MAX_IMAGE_PIXELS = 32000000;

  function clamp(value, min, max) { return Math.min(max, Math.max(min, value)); }
  function sanitizeState(input = {}) {
    const state = { ...DEFAULTS };
    if (!input || typeof input !== 'object' || Array.isArray(input)) return state;
    for (const [key, values] of Object.entries(ENUMS)) {
      if (values.includes(input[key])) state[key] = input[key];
    }
    for (const [key, [min, max]] of Object.entries(LIMITS)) {
      if (typeof input[key] === 'number' && Number.isFinite(input[key])) state[key] = clamp(Math.round(input[key]), min, max);
    }
    if (typeof input.caption === 'boolean') state.caption = input.caption;
    for (const [key, limit] of [['title', 70], ['subtitle', 65]]) {
      if (typeof input[key] === 'string') state[key] = input[key].replace(/[\u0000-\u001f\u007f]/g, ' ').slice(0, limit);
    }
    return state;
  }

  function exportDimensions(ratio, multiplier = 2) {
    const size = RATIOS[ratio] || RATIOS.landscape;
    const scale = multiplier === 1 ? 1 : 2;
    return { width: size.width * scale, height: size.height * scale };
  }

  function slug(text) {
    return String(text || 'composition').normalize('NFKD').replace(/[\u0300-\u036f]/g, '')
      .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 55) || 'composition';
  }

  function validateImageFile(file) {
    if (!file) throw new Error('Choose an image to continue.');
    if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type)) throw new Error('Use a PNG, JPG, or WebP image. SVG and animated formats are not supported.');
    if (!file.size) throw new Error('This file is empty. Try a different image.');
    if (file.size > MAX_FILE_BYTES) throw new Error('This image is larger than 12 MB. Resize it and try again.');
  }

  function validateDimensions(width, height) {
    if (!Number.isFinite(width) || !Number.isFinite(height) || width < 1 || height < 1) throw new Error('This image could not be decoded. Try another PNG, JPG, or WebP.');
    if (width * height > MAX_IMAGE_PIXELS || width > 16384 || height > 16384) throw new Error('This image is too large to edit safely. Use at most 32 megapixels and 16,384 pixels per side.');
  }

  function parseProject(text) {
    if (typeof text !== 'string' || text.length > MAX_PROJECT_BYTES) throw new Error('Project files must be smaller than 18 MB.');
    let data;
    try { data = JSON.parse(text); } catch { throw new Error('This is not a readable Folioframe project. Choose a .folio.json file.'); }
    if (!data || data.format !== 'folioframe' || data.version !== 1 || !data.state || typeof data.state !== 'object' || Array.isArray(data.state)) {
      throw new Error('This project format is not supported. Open a version 1 Folioframe project.');
    }
    const state = sanitizeState(data.state);
    let image = null;
    if (state.source === 'upload') {
      if (!data.image || typeof data.image.data !== 'string' ||
          !/^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/]+={0,2}$/.test(data.image.data) ||
          data.image.data.length > Math.ceil(MAX_FILE_BYTES / 3) * 4 + 64) {
        throw new Error('The embedded image is missing or invalid. Reopen a complete project, or upload the image again.');
      }
      image = { data: data.image.data, name: typeof data.image.name === 'string' ? data.image.name.slice(0, 120) : 'Imported image' };
    }
    return { state, image };
  }

  function serializeProject(state, image) {
    const clean = sanitizeState(state);
    if (clean.source === 'upload' && !image?.data) throw new Error('Upload an image before saving this project.');
    return JSON.stringify({ format: 'folioframe', version: 1, state: clean, image: clean.source === 'upload' ? { data: image.data, name: image.name } : null }, null, 2);
  }

  function createHistory(initial, capacity = 40) {
    let entries = [{ ...initial }];
    let index = 0;
    return {
      push(state) {
        if (JSON.stringify(entries[index]) === JSON.stringify(state)) return false;
        entries = entries.slice(0, index + 1);
        entries.push({ ...state });
        if (entries.length > capacity) entries.shift();
        index = entries.length - 1;
        return true;
      },
      undo() { if (index > 0) index--; return { ...entries[index] }; },
      redo() { if (index < entries.length - 1) index++; return { ...entries[index] }; },
      reset(state) { entries = [{ ...state }]; index = 0; },
      get canUndo() { return index > 0; },
      get canRedo() { return index < entries.length - 1; }
    };
  }

  return { RATIOS, PALETTES, SAMPLES, DEFAULTS, MAX_FILE_BYTES, MAX_PROJECT_BYTES, MAX_IMAGE_PIXELS,
    clamp, sanitizeState, exportDimensions, slug, validateImageFile, validateDimensions,
    parseProject, serializeProject, createHistory };
});
