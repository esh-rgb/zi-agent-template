import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ctx = path.join(root, 'ops', 'zi', 'ai.nanoco.nanoclaw', 'context');
const skills = path.join(root, 'ops', 'zi', 'skills');

/** Collapse newlines so assertions survive prose reflow without weakening them. */
const flat = (s) => s.replace(/\s+/g, ' ');
const read = (p) => flat(fs.readFileSync(p, 'utf-8'));
const instructions = read(path.join(ctx, 'instructions.md'));
const defenses = read(path.join(ctx, 'additional_context', 'injection-defenses.md'));
const approval = read(path.join(ctx, 'additional_context', 'approval-policy.md'));
const boundary = read(path.join(skills, 'trust-boundary', 'SKILL.md'));
const corpus = [instructions, defenses, approval, boundary].join('\n');

/**
 * Coverage, not proof. These assert that a named defense clause EXISTS for each
 * attack the brief requires. Whether the model then behaves correctly is a live
 * test, recorded in VM_ACCEPTANCE.md — never inferred from this file passing.
 */
const ATTACKS = [
  ['direct prompt injection', /ignore previous instructions/i],
  ['indirect prompt injection', /retrieved|web pages|uploaded files/i],
  ['prompt extraction', /system prompt|hidden instructions/i],
  ['secret extraction', /secret|credential|token/i],
  ['memory exfiltration', /exfiltration/i],
  ['cross-context leakage', /another (context|member|group)/i],
  ['tool-output injection', /tool output is (tainted|`UNTRUSTED`)/i],
  ['privilege escalation', /act as admin|privilege escalation|I'm the admin/i],
  ['approval bypass', /approval bypass|already approved/i],
  ['malicious links or files', /malicious link/i],
  ['recipient substitution', /recipient substitution|change a recipient/i],
  ['hallucinated verification', /hallucinated verification/i],
  ['encoded or obfuscated instruction', /obfuscated|encoded/i],
];

for (const [attack, pattern] of ATTACKS) {
  test(`a defense clause exists for: ${attack}`, () => {
    assert.match(corpus, pattern);
  });
}

test('untrusted content is defined as data, never authority', () => {
  assert.match(corpus, /data,? (?:not|never) authority/i);
});

test('the correct outcomes are named and silent execution is ruled out', () => {
  assert.match(defenses, /BLOCK/);
  assert.match(defenses, /REQUIRE_HUMAN_REVIEW/);
  assert.match(defenses, /[Ss]ilent execution is always wrong/);
});

test('every untrusted source class from the brief is enumerated', () => {
  for (const source of [
    /community/i, /whatsapp/i, /email/i, /voice-note/i, /quoted/i, /forwarded/i,
    /uploaded files/i, /web pages/i, /RAG/i, /connector metadata/i, /tool/i,
  ]) {
    assert.match(defenses, source);
  }
});

test('secrets are barred from memory, logs and output', () => {
  assert.match(defenses, /[Nn]ever place secrets in memory, embeddings, summaries, debug output, logs/);
});
