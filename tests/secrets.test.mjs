import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SKIP = new Set(['.git', 'node_modules']);

/** Shapes that must never appear in a public template, even as an example. */
const PATTERNS = [
  [/\bsk-[A-Za-z0-9]{16,}/, 'API key'],
  [/\bghp_[A-Za-z0-9]{20,}/, 'GitHub token'],
  [/\bxox[baprs]-[A-Za-z0-9-]{10,}/, 'Slack token'],
  [/\bAKIA[0-9A-Z]{16}\b/, 'AWS access key'],
  [/\beyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\./, 'JWT'],
  [/-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/, 'private key'],
  [/\bBearer\s+[A-Za-z0-9._-]{20,}/, 'bearer token'],
  [/\bhttps:\/\/[a-z0-9]{16,}\.supabase\.co/, 'live Supabase project'],
];

/** Internal identifiers from the originating organization. The template is generic. */
const INTERNAL = [
  [/@jafi\.org/i, 'internal email domain'],
  [/\bjewish agency\b/i, 'organization name'],
  [/\baliyapp\b/i, 'internal product name'],
  [/\bjafo\b/i, 'internal project name'],
  [/\bbettermode\b/i, 'internal vendor'],
];

function walk(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (SKIP.has(entry.name)) continue;
    const abs = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(abs));
    else out.push(abs);
  }
  return out;
}

const files = walk(root);

test('no secret-shaped value anywhere in the repository', () => {
  const hits = [];
  for (const file of files) {
    const body = fs.readFileSync(file, 'utf-8');
    for (const [pattern, label] of PATTERNS) {
      // Report the file and the kind, never the matched value.
      if (pattern.test(body)) hits.push(`${path.relative(root, file)}: ${label}`);
    }
  }
  assert.deepEqual(hits, [], `secret-shaped content found:\n${hits.join('\n')}`);
});

test('no internal organizational identifiers in the public template', () => {
  const hits = [];
  for (const file of files) {
    // This test file names the patterns it forbids; exclude it from its own scan.
    if (file === fileURLToPath(import.meta.url)) continue;
    const body = fs.readFileSync(file, 'utf-8');
    for (const [pattern, label] of INTERNAL) {
      if (pattern.test(body)) hits.push(`${path.relative(root, file)}: ${label}`);
    }
  }
  assert.deepEqual(hits, [], `internal identifiers found:\n${hits.join('\n')}`);
});

test('the template declares no credentials of its own', () => {
  const mcp = JSON.parse(
    fs.readFileSync(path.join(root, 'ops', 'zi', 'mcp.json'), 'utf-8'),
  );
  const serialized = JSON.stringify(mcp);
  for (const key of ['TOKEN', 'SECRET', 'PASSWORD', 'API_KEY', 'CREDENTIAL', 'PRIVATE_KEY']) {
    if (serialized.includes(key)) {
      assert.match(
        serialized,
        new RegExp(`"[^"]*${key}[^"]*":\\s*"placeholder"`),
        `${key} must be exactly "placeholder"`,
      );
    }
  }
});
