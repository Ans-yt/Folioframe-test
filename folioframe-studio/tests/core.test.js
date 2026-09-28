const assert = require('node:assert/strict');
const core = require('../js/core.js');

function test(name, callback) {
  try { callback(); console.log(`✓ ${name}`); }
  catch (error) { console.error(`✗ ${name}`); throw error; }
}

test('sanitizes unknown settings without mutating the default shape', () => {
  const state = core.sanitizeState({ template: 'nope', ratio: 'square', scale: 999, title: '<unsafe>' });
  assert.equal(state.template, 'studio');
  assert.equal(state.ratio, 'square');
  assert.equal(state.scale, 94);
  assert.equal(state.title, '<unsafe>');
  assert.equal(state.caption, true);
});

test('calculates the correct 2× export dimensions', () => {
  assert.deepEqual(core.exportDimensions('landscape', 2), { width: 2880, height: 1920 });
  assert.deepEqual(core.exportDimensions('portrait', 2), { width: 2160, height: 2700 });
});

test('round trips a sample project with safe state', () => {
  const state = core.sanitizeState({ ratio: 'portrait', backdrop: 'sage', title: 'A quiet handoff' });
  const parsed = core.parseProject(core.serializeProject(state, null));
  assert.deepEqual(parsed.state, state);
  assert.equal(parsed.image, null);
});

test('round trips an embedded image project', () => {
  const state = core.sanitizeState({ source: 'upload', title: 'Imported screen' });
  const image = { data: 'data:image/png;base64,AAAA', name: 'screen.png' };
  const parsed = core.parseProject(core.serializeProject(state, image));
  assert.equal(parsed.state.source, 'upload');
  assert.deepEqual(parsed.image, image);
});

test('rejects malformed project files', () => {
  assert.throws(() => core.parseProject('{"format":"wrong"}'), /project format is not supported/i);
  assert.throws(() => core.parseProject(core.serializeProject(core.sanitizeState({ source: 'upload' }), null)), /Upload an image/);
});

test('history moves backward and forward without losing the branch', () => {
  const history = core.createHistory({ value: 0 });
  history.push({ value: 1 }); history.push({ value: 2 });
  assert.equal(history.canUndo, true);
  assert.deepEqual(history.undo(), { value: 1 });
  assert.deepEqual(history.redo(), { value: 2 });
  history.undo(); history.push({ value: 3 });
  assert.equal(history.canRedo, false);
  assert.deepEqual(history.undo(), { value: 1 });
});

console.log('\nFolioframe core checks passed.');
