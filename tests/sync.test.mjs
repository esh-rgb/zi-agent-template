import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { exportLegacy, CANONICAL, LEGACY } from '../scripts/export-legacy.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

/** Every file under dir, as paths relative to it. */
function tree(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir, { recursive: true })
    .filter((f) => fs.statSync(path.join(dir, f)).isFile())
    .map((f) => f.split(path.sep).join('/'))
    .sort();
}

/** Path -> contents, for byte comparison. */
function snapshot(dir) {
  return tree(dir).map((f) => [f, fs.readFileSync(path.join(dir, f), 'utf-8')]);
}

// Export to a temp directory: test files run concurrently, and regenerating the
// committed build/ in-place would race the other suites reading it.
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'zi-export-'));
const fresh = exportLegacy(tmp);

test('the committed legacy export is current', () => {
  assert.deepEqual(
    snapshot(LEGACY),
    snapshot(fresh),
    'build/legacy is stale — run `npm run build` and commit the result',
  );
});

test('one persona: instructions are byte-identical across both layouts', () => {
  const canonical = fs.readFileSync(
    path.join(CANONICAL, 'ai.nanoco.nanoclaw', 'context', 'instructions.md'),
  );
  const legacy = fs.readFileSync(path.join(LEGACY, 'context', 'instructions.md'));
  assert.ok(canonical.equals(legacy), 'the two layouts have drifted apart');
});

test('every canonical skill, task and context file reaches the legacy layout', () => {
  const nc = path.join(CANONICAL, 'ai.nanoco.nanoclaw');
  assert.deepEqual(tree(path.join(CANONICAL, 'skills')), tree(path.join(LEGACY, 'skills')));
  assert.deepEqual(tree(path.join(nc, 'tasks')), tree(path.join(LEGACY, 'tasks')));
  assert.deepEqual(tree(path.join(nc, 'context')), tree(path.join(LEGACY, 'context')));
});

test('the legacy layout carries the marker the older parser requires', () => {
  // Forks predating Agent Plugins support key off context/instructions.md at the root.
  assert.ok(fs.existsSync(path.join(LEGACY, 'context', 'instructions.md')));
  assert.ok(fs.existsSync(path.join(LEGACY, '.mcp.json')));
});

test('the canonical layout carries the Agent Plugins discovery marker', () => {
  assert.ok(fs.existsSync(path.join(CANONICAL, 'plugin.json')));
  assert.ok(
    fs.existsSync(path.join(CANONICAL, 'ai.nanoco.nanoclaw', 'context', 'instructions.md')),
  );
});

test('build/ is marked generated', () => {
  const readme = fs.readFileSync(path.join(root, 'build', 'legacy', 'README.md'), 'utf-8');
  assert.match(readme, /do not edit/i);
});
