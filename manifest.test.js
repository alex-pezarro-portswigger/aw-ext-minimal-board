import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import manifest, { dir } from './index.js';
import pkg from './package.json' with { type: 'json' };
import lock from './package-lock.json' with { type: 'json' };

const css = () => readFileSync(path.join(dir, manifest.styles), 'utf8');
// Top-level selector lists, comments stripped. No nested at-rules in this sheet.
const selectors = () => css()
  .replace(/\/\*[\s\S]*?\*\//g, '')
  .split('}')
  .map((block) => block.split('{')[0].trim())
  .filter(Boolean)
  .flatMap((list) => list.split(',').map((s) => s.trim()));

test('the manifest is well formed', () => {
  assert.match(manifest.id, /^[a-z][a-z0-9-]*$/);
  assert.equal(typeof manifest.label, 'string');
  assert.equal(manifest.defaultEnabled, true);
  assert.deepEqual(manifest.requires, []);
  assert.equal(manifest.engines.wranglerApi, '^1.0.0');
});

test('the manifest matches the package.json declaration', () => {
  const decl = pkg.wranglerExtension;
  assert.equal(decl.id, manifest.id);
  assert.equal(decl.label, manifest.label);
  assert.deepEqual(decl.requires, manifest.requires);
  assert.equal(pkg.type, 'module');
});

test('the lockfile matches package.json', () => {
  assert.equal(lock.name, pkg.name);
  assert.equal(lock.version, pkg.version);
});

test('it is styles only, and the stylesheet sits inside the extension', () => {
  assert.equal(manifest.client, undefined);
  assert.match(manifest.styles, /^public\/[^/]+\.css$/);
  assert.ok(existsSync(path.join(dir, manifest.styles)));
});

test('every rule is scoped to the board grid, never the detail panel', () => {
  const sels = selectors();
  assert.ok(sels.length > 0);
  for (const s of sels) assert.match(s, /^#grid\b/, `unscoped selector: ${s}`);
});

test('it stacks lanes and hides the chips, path and icons', () => {
  const text = css();
  assert.match(text, /grid-template-columns:\s*minmax\(0, 1fr\) !important/);
  for (const hidden of ['.card-loc', '.card-meta', '.card-name-row > :not(.card-name)']) {
    assert.ok(text.includes(`#grid .session-card ${hidden}`), `${hidden} is not hidden`);
  }
});

test('each status has its own colour', () => {
  const text = css();
  const colourOf = (cls) => text.match(new RegExp(`\\.session-card\\.${cls}[^{]*\\{ --mb-status: ([^;]+);`))?.[1];
  const colours = ['working', 'needs-you', 'just-finished'].map(colourOf);
  colours.push(text.match(/#grid \.session-card \{\s*--mb-status: ([^;]+);/)[1]); // idle
  assert.ok(colours.every(Boolean), `missing a colour: ${colours}`);
  assert.equal(new Set(colours).size, colours.length);
});

test('the opened card keeps the blue selection fill', () => {
  assert.match(css(), /#grid \.session-card\.selected[^{]*\{ background: color-mix\(in srgb, var\(--blue\)/);
});
