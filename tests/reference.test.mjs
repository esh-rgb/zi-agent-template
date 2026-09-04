import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { loadSchemas, entityNames, validateSeedDir } from '../reference/data-layer/validate.mjs';
import { Store } from '../reference/data-layer/store.mjs';
import { checkConsent } from '../reference/data-layer/consent.mjs';
import { handle, toolManifest, HUMAN_ONLY_STATUS } from '../reference/data-layer/mcp-server.mjs';
import { issueToken, redeemToken, deepLink, redact } from '../reference/onboarding/deep-link.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const reference = path.join(root, 'reference');

/**
 * The reference implementations are optional and unsupported, and these tests
 * hold them to the rules the template states rather than to a feature list. A
 * reference that quietly violates a template invariant is worse than no reference.
 */

// --- schemas and seed ---

test('every entity in data-layer.md has a schema', () => {
  const contract = fs.readFileSync(
    path.join(root, 'ops/zi/ai.nanoco.nanoclaw/context/additional_context/data-layer.md'),
    'utf-8',
  );
  const declared = entityNames(loadSchemas());
  for (const entity of declared) {
    // The contract table names each entity with a capitalized label.
    const label = entity[0].toUpperCase() + entity.slice(1);
    assert.match(contract, new RegExp(`\`${label}\``), `${entity} is not in data-layer.md`);
  }
  assert.equal(declared.length, 13, 'the contract table lists thirteen entities');
});

test('the seed validates against the schemas', () => {
  assert.deepEqual(validateSeedDir(), []);
});

test('every schema requires provenance', () => {
  const schemas = loadSchemas();
  for (const name of entityNames(schemas)) {
    assert.ok(
      schemas.get(name).required?.includes('provenance'),
      `${name} must require provenance -- a record with no traceable origin is a rumor`,
    );
  }
});

test('an event schema requires exactly the fields verification.md requires', () => {
  const event = loadSchemas().get('event');
  for (const field of ['title', 'date', 'start_time', 'audience', 'organizer', 'how_to_attend']) {
    assert.ok(event.required.includes(field), `event must require ${field}`);
  }
});

// --- the store ---

test('the store fetches by reference and offers no bundle call', () => {
  const store = new Store();
  assert.equal(store.get('event', 'evt_solder_night').status, 'VERIFIED');
  assert.equal(store.get('event', 'nope'), null);
  // Deliberate absence: a specialist receives ids and fetches what it needs.
  for (const forbidden of ['everythingAbout', 'profile', 'fullRecord', 'dump']) {
    assert.equal(typeof store[forbidden], 'undefined', `${forbidden}() must not exist`);
  }
});

test('a record with no provenance is refused', () => {
  const store = new Store();
  assert.throws(
    () => store.put('location', { location_id: 'loc_x', name: 'X' }),
    /rumor with a schema/,
  );
});

test('put stamps when the record changed, and validates it', () => {
  const store = new Store();
  const stored = store.put('location', {
    location_id: 'loc_south',
    name: 'South side',
    provenance: { source: 'operator', recorded_at: '2026-02-01T09:00:00Z' },
  });
  assert.ok(stored.provenance.last_changed_at, 'last_changed_at must be stamped');
  assert.throws(() => store.put('location', { location_id: 'loc_bad', provenance: { source: 's', recorded_at: '2026-02-01T09:00:00Z' } }), /invalid/);
});

// --- the consent gate ---

test('no consent record means no transfer', () => {
  const verdict = checkConsent([], { user_id: 'usr_rae', purpose: 'matching', fields: ['interests'] });
  assert.equal(verdict.allowed, false);
  assert.match(verdict.reason, /no Consent record/);
});

test('a consent for one purpose is not consent for another', () => {
  const store = new Store();
  const consents = store.list('consent');
  assert.equal(
    checkConsent(consents, { user_id: 'usr_dana', purpose: 'matching', fields: ['interests'] }).allowed,
    true,
  );
  assert.equal(
    checkConsent(consents, {
      user_id: 'usr_dana',
      purpose: 'data_transfer_to_organization',
      fields: ['interests'],
    }).allowed,
    false,
    'matching is not a data transfer',
  );
});

test('withdrawn, expired, wrong-recipient and out-of-scope all deny', () => {
  const base = {
    consent_id: 'cns_t', user_id: 'usr_t', purpose: 'introduction', scope: ['display_name'],
    granted_at: '2026-01-01T00:00:00Z', recipient_ref: 'usr_a',
    provenance: { source: 's', recorded_at: '2026-01-01T00:00:00Z' },
  };
  const ask = (over, req = {}) =>
    checkConsent([{ ...base, ...over }], {
      user_id: 'usr_t', purpose: 'introduction', fields: ['display_name'],
      recipient_ref: 'usr_a', now: '2026-06-01T00:00:00Z', ...req,
    });

  assert.equal(ask({}).allowed, true, 'the control case must pass, or the rest proves nothing');
  assert.match(ask({ withdrawn_at: '2026-02-01T00:00:00Z' }).reason, /withdrawn/);
  assert.match(ask({ expires_at: '2026-03-01T00:00:00Z' }).reason, /expired/);
  assert.match(ask({}, { recipient_ref: 'usr_b' }).reason, /different recipient/);
  assert.match(ask({}, { fields: ['location_id'] }).reason, /does not cover/);
  assert.match(ask({}, { fields: [] }).reason, /unscoped transfer is never permitted/);
});

test('disclose is the only path to another person\'s personal fields, and it is gated', () => {
  const store = new Store();
  const denied = store.disclose('person', 'usr_rae', { purpose: 'matching', fields: ['interests'] });
  assert.equal(denied.allowed, false);
  assert.equal(denied.data, null, 'a refusal must return no data');

  const allowed = store.disclose('person', 'usr_dana', { purpose: 'matching', fields: ['interests'] });
  assert.equal(allowed.allowed, true);
  assert.deepEqual(Object.keys(allowed.data), ['interests'], 'only the requested fields cross');
});

test('forget removes what this store holds and is audited, not silent', () => {
  const log = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'zi-audit-')), 'audit.jsonl');
  const store = new Store({ auditLog: log });
  const removed = store.forget('usr_dana');
  assert.ok(removed.length > 0);
  assert.equal(store.query('offer', { user_id: 'usr_dana' }).length, 0);
  const entries = fs.readFileSync(log, 'utf-8').trim().split('\n').map((l) => JSON.parse(l));
  assert.ok(entries.some((e) => e.action === 'forget'));
});

test('the audit log records refusals as well as permissions', () => {
  const log = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'zi-audit-')), 'audit.jsonl');
  const store = new Store({ auditLog: log });
  store.disclose('person', 'usr_rae', { purpose: 'matching', fields: ['interests'] });
  const entries = fs.readFileSync(log, 'utf-8').trim().split('\n').map((l) => JSON.parse(l));
  assert.ok(entries.some((e) => e.action === 'disclose' && e.allowed === false));
});

// --- the MCP server ---

test('the reference MCP server needs no credentials', () => {
  const source = fs.readFileSync(path.join(reference, 'data-layer/mcp-server.mjs'), 'utf-8');
  for (const shape of [/TOKEN/, /SECRET/, /API_?KEY/i, /PASSWORD/, /Authorization/]) {
    assert.doesNotMatch(source, shape, 'the reference server holds no credential');
  }
});

test('the reference MCP server exposes no externally-visible write', () => {
  // Nothing here may send, publish, write a calendar or contact anyone: a data
  // layer reached through MCP must not become an approval bypass.
  for (const tool of toolManifest()) {
    assert.doesNotMatch(
      tool.name,
      /send|publish|post|email|message|invite|delete|calendar|notify/i,
      `${tool.name} would be an externally-visible write`,
    );
  }
  assert.ok(toolManifest().length >= 4);
});

test('the reference MCP server refuses to assign a human-only status', () => {
  assert.deepEqual([...HUMAN_ONLY_STATUS].sort(), ['APPROVED', 'PUBLISHED', 'VERIFIED']);
  const response = handle({
    jsonrpc: '2.0', id: 1, method: 'tools/call',
    params: {
      name: 'community_record',
      arguments: {
        entity: 'event',
        record: {
          event_id: 'evt_probe', title: 't', date: '2026-01-01', start_time: '10:00',
          audience: 'a', organizer: 'o', how_to_attend: 'h', status: 'VERIFIED',
          provenance: { source: 's', recorded_at: '2026-01-01T00:00:00Z' },
        },
      },
    },
  });
  assert.equal(response.result.isError, true);
  assert.match(response.result.content[0].text, /named human verifier/);
});

// --- the onboarding reference ---

test('the onboarding page makes no network request and stores nothing', () => {
  const page = fs.readFileSync(path.join(reference, 'onboarding/index.html'), 'utf-8');
  for (const shape of [
    /fetch\s*\(/, /XMLHttpRequest/, /sendBeacon/, /WebSocket/, /<script[^>]+src=/i,
    /<link[^>]+href=/i, /https?:\/\//, /localStorage/, /sessionStorage/, /document\.cookie/,
  ]) {
    assert.doesNotMatch(page, shape, 'the onboarding reference must stay self-contained');
  }
});

test('the onboarding page collects the four screens and separates the two consents', () => {
  const page = fs.readFileSync(path.join(reference, 'onboarding/index.html'), 'utf-8');
  assert.equal((page.match(/data-screen="/g) ?? []).length, 5, 'four screens plus the handoff');
  assert.match(page, /name="consent_personalization"/);
  assert.match(page, /name="consent_matching"/);
});

test('a linking token is single-use, expiring, and never accepted from message content', () => {
  const { token, record } = issueToken('usr_rae');
  assert.ok(!record.token_hash.includes(token), 'the raw token is never stored');

  assert.match(redeemToken(record, token, { source: 'message' }).reason, /message content/);

  const first = redeemToken(record, token);
  assert.equal(first.ok, true);
  assert.equal(first.user_id, 'usr_rae');
  assert.match(redeemToken(first.consumed, token).reason, /already used/);

  const { token: t2, record: r2 } = issueToken('usr_rae', { ttlMs: 1, now: 0 });
  assert.match(redeemToken(r2, t2, { now: 1000 }).reason, /expired/);
  assert.match(redeemToken(record, 'wrong-token').reason, /already used|does not match/);
});

test('the token is redacted out of anything that could be logged', () => {
  const { token } = issueToken('usr_rae');
  const link = deepLink({ base: 'https://example.invalid/zi', token });
  assert.ok(link.includes(token));
  assert.ok(!redact(link).includes(token), 'redact must strip the token');
});

// --- labeling ---

test('every reference directory says it is optional and unsupported', () => {
  for (const dir of fs.readdirSync(reference)) {
    const readme = fs.readFileSync(path.join(reference, dir, 'README.md'), 'utf-8');
    assert.match(readme, /\*\*Optional/i, `reference/${dir} must open by saying it is optional`);
  }
});

test('no reference claims to enforce anything or to change an approval level', () => {
  const walk = (dir) =>
    fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
      e.isDirectory() ? walk(path.join(dir, e.name)) : [path.join(dir, e.name)],
    );
  for (const file of walk(reference).filter((f) => /\.(md|mjs|html)$/.test(f))) {
    const body = fs.readFileSync(file, 'utf-8');
    const rel = path.relative(root, file);
    assert.doesNotMatch(body, /guarantees? (?:that )?(?:the|an?) (?:agent|model)/i, `${rel} overclaims`);
    assert.doesNotMatch(body, /lowers? the approval level|without approval is fine/i, `${rel} overclaims`);
  }
});
