#!/usr/bin/env node
/**
 * File-backed reference community data layer.
 *
 * Optional and unsupported. `ops/zi` ships no database and does not require this;
 * an operator may wire this, an MCP server of their own, or nothing at all. See
 * README.md in this directory before using it for anything real.
 *
 * Design rules, each taken from the template's own text:
 *
 *   - Fetch by reference. `get(entity, id)` and `query` only. There is deliberately
 *     no "everything known about this person" call: a specialist receives ids and
 *     fetches what it needs (orchestration.md).
 *   - Records carry provenance. `put` refuses a record without it and stamps
 *     `last_changed_at` (data-layer.md).
 *   - Personal fields cross only with a Consent record for that purpose
 *     (consent.mjs).
 *   - The audit log is append-only. Nothing here deletes external state; the only
 *     deletion is a member exercising their own privacy right, which is recorded
 *     rather than silent.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { checkConsent, personalFields } from './consent.mjs';
import { loadSchemas, validate } from './validate.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));

/** The id field each entity is keyed by. */
const KEY = {
  person: 'user_id',
  organization: 'organization_id',
  community: 'community_id',
  event: 'event_id',
  opportunity: 'opportunity_id',
  need: 'need_id',
  offer: 'offer_id',
  content: 'content_id',
  conversation: 'conversation_id',
  location: 'location_id',
  relationship: 'relationship_id',
  consent: 'consent_id',
  task: 'task_id',
};

export class Store {
  /**
   * @param {object} options
   * @param {string} [options.dir]       Directory of `*.json` collection files.
   * @param {string} [options.writesDir] Where `save()` writes by default. Kept
   *   out of `dir` on purpose: `dir` is also what `load()` re-reads on the next
   *   `new Store()`, and a save target inside the load path would have the next
   *   load read both the seed and the save, concatenating the same records.
   *   Defaults to a `writes/` sibling of `dir` so a fresh install needs no config.
   * @param {string} [options.auditLog]  Append-only JSONL path; null disables it.
   */
  constructor({ dir = path.join(here, 'seed'), writesDir, auditLog = null } = {}) {
    this.dir = dir;
    this.writesDir = writesDir ?? path.join(path.dirname(dir), 'writes');
    this.auditLog = auditLog;
    this.schemas = loadSchemas();
    this.collections = new Map();
    this.load();
  }

  /**
   * Read every collection file in `dir` into memory, then in `writesDir` if it
   * differs and exists. A record present in both is kept once, by id, with the
   * later file's version winning -- so a write survives a reload instead of
   * appearing twice or being shadowed by the seed. "Later" means later in
   * directory-read order, which `readdirSync` does not guarantee is stable
   * across filesystems; `writesDir` is read after `dir` specifically so a saved
   * write always wins the tie against the seed it started from.
   */
  load() {
    this.collections.clear();
    const dirs = this.writesDir === this.dir ? [this.dir] : [this.dir, this.writesDir];
    for (const dir of dirs) {
      if (!fs.existsSync(dir)) continue;
      for (const file of fs.readdirSync(dir).filter((f) => f.endsWith('.json'))) {
        const data = JSON.parse(fs.readFileSync(path.join(dir, file), 'utf-8'));
        for (const [entity, records] of Object.entries(data)) {
          const key = KEY[entity];
          if (!key) throw new Error(`${file}: unknown entity "${entity}"`);
          const existing = this.collections.get(entity) ?? [];
          const merged = new Map(existing.map((r) => [r[key], r]));
          for (const record of records) merged.set(record[key], record);
          this.collections.set(entity, [...merged.values()]);
        }
      }
    }
  }

  entities() {
    return [...this.collections.keys()].sort();
  }

  /** One record by its own id. The only way in. */
  get(entity, id) {
    const key = KEY[entity];
    if (!key) throw new Error(`unknown entity "${entity}"`);
    return (this.collections.get(entity) ?? []).find((r) => r[key] === id) ?? null;
  }

  /** A whole collection, unfiltered. Community-level data only -- see `about`. */
  list(entity) {
    if (!KEY[entity]) throw new Error(`unknown entity "${entity}"`);
    return [...(this.collections.get(entity) ?? [])];
  }

  /** Records whose fields all equal the given values. Exact match, no fuzziness. */
  query(entity, where = {}) {
    return this.list(entity).filter((record) =>
      Object.entries(where).every(([field, value]) =>
        Array.isArray(record[field]) ? record[field].includes(value) : record[field] === value,
      ),
    );
  }

  /**
   * Personal data about one person, for one stated purpose.
   *
   * This is the only path that returns another person's personal fields, and it
   * refuses unless a Consent record covers exactly that purpose, recipient and
   * field set. A refusal is an answer: hand the reason back and ask the person.
   */
  disclose(entity, id, { purpose, fields, recipient_ref, now } = {}) {
    const record = this.get(entity, id);
    if (!record) return { allowed: false, reason: `no ${entity} ${id}`, data: null };

    const user_id = record.user_id ?? (entity === 'person' ? record[KEY[entity]] : null);
    const requested = fields ?? personalFields(record);
    const verdict = checkConsent(this.list('consent'), {
      user_id,
      purpose,
      fields: requested,
      recipient_ref,
      now,
    });
    this.audit({ action: 'disclose', entity, id, purpose, recipient_ref, allowed: verdict.allowed, reason: verdict.reason });
    if (!verdict.allowed) return { ...verdict, data: null };

    const data = Object.fromEntries(requested.map((f) => [f, record[f]]));
    return { ...verdict, data };
  }

  /**
   * Write a record. Validates against the entity schema, refuses one with no
   * provenance, and stamps when it changed. Never silently merges: the caller
   * passes the record it means to store.
   */
  put(entity, record) {
    const schema = this.schemas.get(entity);
    if (!schema) throw new Error(`unknown entity "${entity}"`);
    if (!record.provenance) {
      throw new Error(`${entity}: a record with no provenance is a rumor with a schema`);
    }
    const stamped = {
      ...record,
      provenance: { ...record.provenance, last_changed_at: new Date().toISOString() },
    };
    const problems = validate(stamped, schema, { schemas: this.schemas, self: schema });
    if (problems.length) throw new Error(`${entity} is invalid:\n  - ${problems.join('\n  - ')}`);

    const key = KEY[entity];
    const records = this.collections.get(entity) ?? [];
    const at = records.findIndex((r) => r[key] === stamped[key]);
    if (at === -1) records.push(stamped);
    else records[at] = stamped;
    this.collections.set(entity, records);
    this.audit({ action: at === -1 ? 'create' : 'update', entity, id: stamped[key] });
    return stamped;
  }

  /**
   * Forget everything held about one person -- the privacy right from
   * `privacy-controls`. Explicitly NOT an external delete: this removes only what
   * this store holds, and the removal itself is audited rather than silent.
   */
  forget(user_id) {
    const removed = [];
    for (const [entity, records] of this.collections) {
      const kept = records.filter((r) => {
        const mine = r.user_id === user_id || (entity === 'person' && r.user_id === user_id);
        if (mine) removed.push(`${entity}:${r[KEY[entity]]}`);
        return !mine;
      });
      this.collections.set(entity, kept);
    }
    this.audit({ action: 'forget', user_id, removed: removed.length });
    return removed;
  }

  /**
   * Persist the in-memory collections back to a single file, in `writesDir` by
   * default -- never `dir`, so the next `load()` does not read this file as a
   * second copy of the seed it came from.
   */
  save(file = path.join(this.writesDir, 'store.json')) {
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, `${JSON.stringify(Object.fromEntries(this.collections), null, 2)}\n`);
    return file;
  }

  /** Append-only. Never rewrites, never truncates, and never records a secret. */
  audit(entry) {
    if (!this.auditLog) return;
    fs.mkdirSync(path.dirname(this.auditLog), { recursive: true });
    fs.appendFileSync(this.auditLog, `${JSON.stringify({ at: new Date().toISOString(), ...entry })}\n`);
  }
}

export { KEY as ID_FIELDS };
