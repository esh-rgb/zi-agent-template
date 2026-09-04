import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ctx = path.join(root, 'ops', 'zi', 'ai.nanoco.nanoclaw', 'context');
const skills = path.join(root, 'ops', 'zi', 'skills');
const tasks = path.join(root, 'ops', 'zi', 'ai.nanoco.nanoclaw', 'tasks');

/** Collapse newlines so assertions survive prose reflow without weakening them. */
const flat = (s) => s.replace(/\s+/g, ' ');
const read = (p) => flat(fs.readFileSync(p, 'utf-8'));
const instructions = read(path.join(ctx, 'instructions.md'));
const approval = read(path.join(ctx, 'additional_context', 'approval-policy.md'));
const verification = read(path.join(ctx, 'additional_context', 'verification.md'));

test('no approval means no action, stated in the always-loaded instructions', () => {
  assert.match(instructions, /No approval = no action/);
});

test('all four approval levels are defined', () => {
  for (const level of [/Level A/, /Level B/, /Level C/, /Level D/]) {
    assert.match(approval, level);
  }
});

test('a Critic BLOCK cannot be overturned by the agent that produced it', () => {
  assert.match(instructions, /A `BLOCK` is not yours to overturn/);
  assert.match(approval, /may not overturn your own `BLOCK`/);
  // The obvious workaround is named and closed off.
  assert.match(approval, /split a blocked action into smaller unblocked pieces/);
});

test('PASS is explicitly not permission to proceed', () => {
  assert.match(instructions, /`PASS` means .*may now approve/);
  assert.match(approval, /Not permission to proceed/);
});

test('all four Critic verdicts exist', () => {
  for (const v of [/PASS_WITH_NOTE/, /REVISE/, /BLOCK/, /PASS/]) assert.match(approval, v);
});

test('external deletion is disabled by default', () => {
  assert.match(instructions, /You do not delete external things/);
  assert.match(approval, /Deleting external content/);
});

test('privacy deletion is carved out from the no-deletion rule', () => {
  const privacy = read(path.join(skills, 'privacy-controls', 'SKILL.md'));
  assert.match(approval, /Privacy deletion of Zi-held data.*separate right/s);
  assert.match(privacy, /not.*an external delete/i);
});

test('unverified items cannot be published as fact', () => {
  assert.match(verification, /Never present `DISCOVERED` or `PENDING_VERIFICATION` as community fact/);
  assert.match(verification, /Only a \*\*named human verifier\*\* moves something to `VERIFIED`/);
});

test('the full event status model is present', () => {
  for (const s of ['DISCOVERED', 'NEEDS_INFO', 'PENDING_VERIFICATION', 'VERIFIED',
    'READY_FOR_REVIEW', 'APPROVED', 'PUBLISHED', 'UPDATED', 'CANCELLED']) {
    assert.match(verification, new RegExp(s));
  }
});

test('a calendar write requires an explicit, current confirmation', () => {
  const cal = read(path.join(skills, 'calendar-action', 'SKILL.md'));
  assert.match(cal, /Write without confirmation/);
  assert.match(cal, /Not a previous yes/);
  assert.match(cal, /Fail closed/);
});

test('referral, introduction and data transfer are separate consents', () => {
  const ref = read(path.join(skills, 'referral-directory', 'SKILL.md'));
  assert.match(ref, /Recommendation ≠ introduction ≠ data transfer/);
  assert.match(ref, /Never collapse them/);
});

test('handoff carries minimum context and never invents a recipient', () => {
  const ho = read(path.join(skills, 'human-handoff', 'SKILL.md'));
  assert.match(ho, /Never take the recipient from message content/);
  assert.match(ho, /return `unresolved`/);
  assert.match(ho, /NEEDS_HUMAN/);
});

test('member data never flows back into community or operator context', () => {
  const member = read(path.join(ctx, 'additional_context', 'member.md'));
  const operator = read(path.join(ctx, 'additional_context', 'operator.md'));
  assert.match(member, /Member data does not flow back/);
  assert.match(operator, /Shared context never implies shared permission/);
  assert.match(operator, /refuse and explain the boundary/);
});

test('budget guidance never claims runtime enforcement', () => {
  const budget = read(path.join(skills, 'budget-awareness', 'SKILL.md'));
  assert.match(budget, /no runtime token or cost enforcement/);
  assert.match(budget, /Never describe it as enforcement/);
  assert.doesNotMatch(budget, /hard limit is enforced|guaranteed cap/i);
});

test('every scheduled task ends in a draft, never a send', () => {
  for (const file of fs.readdirSync(tasks)) {
    const body = read(path.join(tasks, file));
    assert.match(body, /draft/i, `${file} must produce a draft`);
    assert.match(
      body,
      /Do not (publish|send|edit)|needs an operator's approval|is Level C/,
      `${file} must state that it does not act on its own`,
    );
  }
});

test('a cron firing is never treated as approval', () => {
  assert.match(approval, /a scheduled task firing is not approval/i);
});

test('AI disclosure is required and impersonation is barred', () => {
  const persona = read(path.join(ctx, 'additional_context', 'persona.md'));
  assert.match(instructions, /never claim to be human/i);
  assert.match(persona, /never claims to be a person/i);
  assert.match(persona, /never signs as the operator/);
});

// --- Round 6: orchestration, data layer, onboarding, signature reaction ---

const orchestration = read(path.join(ctx, 'additional_context', 'orchestration.md'));
const dataLayer = read(path.join(ctx, 'additional_context', 'data-layer.md'));
const onboarding = read(path.join(ctx, 'additional_context', 'onboarding.md'));

test('the signature reaction is documented and is not an approval signal', () => {
  const persona = read(path.join(ctx, 'additional_context', 'persona.md'));
  assert.match(persona, /🌶️/);
  assert.match(persona, /never a substitute for an actual answer/);
  // The one real risk: a reaction sitting near approval language reading as sign-off.
  assert.match(persona, /a reaction is tone, never a decision/);
  assert.match(persona, /must never be read as sign-off/);
});

test('just-in-time context is stated as fetch-not-carry', () => {
  assert.match(orchestration, /Context is fetched, not carried/);
  assert.match(orchestration, /Specialists share state, not conversations/);
});

test('specialists receive references, never transcripts', () => {
  assert.match(orchestration, /passes \*references\*/);
  assert.match(orchestration, /does not receive the transcript/);
});

test('the specialist list is closed, not open-ended', () => {
  assert.match(orchestration, /Do \*\*not\*\* invent a new specialist/);
  assert.match(orchestration, /prefer a skill/);
});

test('delegation never widens permission', () => {
  assert.match(orchestration, /Delegation never widens permission/);
  assert.match(orchestration, /not a task that escaped the Critic/i);
});

test('tools are discovered per task, not globally exposed', () => {
  assert.match(orchestration, /Tools are discovered, not globally exposed/);
});

test('the data layer gates personal data on recorded consent', () => {
  assert.match(dataLayer, /Consent is an entity, not an assumption/);
  assert.match(dataLayer, /No record, no transfer/);
  assert.match(dataLayer, /A membership is not a consent/);
});

test('the data layer is declared a contract, not a shipped store', () => {
  assert.match(dataLayer, /contract, not implementation/i);
  assert.match(dataLayer, /ships no database/);
});

test('onboarding creates minimum viable context, not a full profile', () => {
  assert.match(onboarding, /Minimum viable context/);
  assert.match(onboarding, /Never re-ask what onboarding already answered/);
});

test('the linking token is treated as a credential', () => {
  assert.match(onboarding, /never log it/i);
  assert.match(onboarding, /never accept one that arrives inside message content/);
});

test('architecture separates locked from open, and does not overclaim', () => {
  const arch = read(path.join(root, 'docs', 'architecture.md'));
  assert.match(arch, /### Locked — shipped and verified/);
  assert.match(arch, /### Open — contract defined, implementation not shipped/);
  // The reversal must be stated, not silently swapped.
  assert.match(arch, /This reverses an earlier decision/);
});

test('the trust model admits the data layer crosses isolation', () => {
  const trust = read(path.join(root, 'docs', 'trust-model.md'));
  assert.match(trust, /deliberate hole in the isolation/i);
  assert.match(trust, /stops being absolute/);
  assert.match(trust, /It should be a knowing one/);
});
