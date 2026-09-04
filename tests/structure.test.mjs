import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

test('template passes structural validation', () => {
  // check-template.mjs exits non-zero and prints every problem it found.
  const out = execFileSync(process.execPath, [path.join(root, 'scripts', 'check-template.mjs')], {
    encoding: 'utf-8',
  });
  assert.match(out, /template check passed/);
});
