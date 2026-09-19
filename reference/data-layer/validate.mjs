#!/usr/bin/env node
/**
 * Minimal JSON Schema validator, standard library only.
 *
 * The repository ships no dependencies and should stay that way, so this
 * implements only the keyword subset the entity schemas in `schema/` actually
 * use: $ref (to `common#/$defs/*` and local `#/$defs/*`), type, required,
 * properties, additionalProperties, enum, items, minItems, minLength, pattern
 * and format (`date`, `date-time`).
 *
 * It is not a conformant draft 2020-12 implementation and does not try to be.
 * If a schema here ever needs a keyword this does not support, add the keyword
 * rather than reaching for a dependency -- see CONTRIBUTING.md.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
export const SCHEMA_DIR = path.join(here, 'schema');
export const SEED_DIR = path.join(here, 'seed');

/** Load every `*.schema.json`, keyed by its `$id` (which equals the entity name). */
export function loadSchemas(dir = SCHEMA_DIR) {
  const schemas = new Map();
  for (const file of fs.readdirSync(dir).filter((f) => f.endsWith('.schema.json'))) {
    const schema = JSON.parse(fs.readFileSync(path.join(dir, file), 'utf-8'));
    if (!schema.$id) throw new Error(`${file} has no $id`);
    schemas.set(schema.$id, schema);
  }
  return schemas;
}

/** Entity schemas are everything except the shared-fragment file. */
export function entityNames(schemas) {
  return [...schemas.keys()].filter((id) => id !== 'common').sort();
}

const DATE = /^\d{4}-\d{2}-\d{2}$/;
const DATE_TIME = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/;

/** Resolve `common#/$defs/id` or `#/$defs/id` against the loaded schema set. */
function resolveRef(ref, schemas, self) {
  const [file, pointer] = ref.split('#');
  const target = file ? schemas.get(file) : self;
  if (!target) throw new Error(`unresolvable $ref: ${ref}`);
  let node = target;
  for (const segment of pointer.split('/').filter(Boolean)) {
    node = node?.[segment.replace(/~1/g, '/').replace(/~0/g, '~')];
    if (node === undefined) throw new Error(`unresolvable $ref: ${ref}`);
  }
  return node;
}

const typeOf = (v) => (Array.isArray(v) ? 'array' : v === null ? 'null' : typeof v);

/**
 * Validate `value` against `schema`. Returns an array of human-readable problems,
 * empty when valid. Collects everything rather than throwing on the first miss,
 * so one run reports the whole record.
 */
export function validate(value, schema, { schemas = new Map(), self = schema, at = '' } = {}) {
  const problems = [];
  const where = at || '(root)';

  if (schema.$ref) {
    return validate(value, resolveRef(schema.$ref, schemas, self), { schemas, self, at });
  }

  if (schema.type && typeOf(value) !== schema.type) {
    problems.push(`${where}: expected ${schema.type}, got ${typeOf(value)}`);
    return problems; // Every other keyword assumes the type matched.
  }

  if (schema.enum && !schema.enum.includes(value)) {
    problems.push(`${where}: ${JSON.stringify(value)} is not one of ${schema.enum.join(', ')}`);
  }

  if (typeof value === 'string') {
    if (schema.minLength !== undefined && value.length < schema.minLength) {
      problems.push(`${where}: shorter than minLength ${schema.minLength}`);
    }
    if (schema.pattern && !new RegExp(schema.pattern).test(value)) {
      problems.push(`${where}: does not match ${schema.pattern}`);
    }
    if (schema.format === 'date' && !DATE.test(value)) {
      problems.push(`${where}: not a YYYY-MM-DD date`);
    }
    if (schema.format === 'date-time' && !DATE_TIME.test(value)) {
      problems.push(`${where}: not an RFC 3339 date-time`);
    }
  }

  if (Array.isArray(value)) {
    if (schema.minItems !== undefined && value.length < schema.minItems) {
      problems.push(`${where}: fewer than minItems ${schema.minItems}`);
    }
    if (schema.items) {
      value.forEach((item, i) => {
        problems.push(...validate(item, schema.items, { schemas, self, at: `${where}[${i}]` }));
      });
    }
  }

  if (typeOf(value) === 'object') {
    for (const key of schema.required ?? []) {
      if (value[key] === undefined) problems.push(`${where}: missing required "${key}"`);
    }
    const properties = schema.properties ?? {};
    for (const [key, sub] of Object.entries(value)) {
      if (properties[key]) {
        problems.push(
          ...validate(sub, properties[key], { schemas, self, at: at ? `${at}.${key}` : key }),
        );
      } else if (schema.additionalProperties === false) {
        problems.push(`${where}: unexpected property "${key}"`);
      }
    }
  }

  return problems;
}

/** Validate one seed collection file: `{ "<entity>": [ ...records ] }`. */
export function validateSeed(seed, schemas) {
  const problems = [];
  for (const [entity, records] of Object.entries(seed)) {
    const schema = schemas.get(entity);
    if (!schema) {
      problems.push(`unknown entity "${entity}" -- no schema/${entity}.schema.json`);
      continue;
    }
    if (!Array.isArray(records)) {
      problems.push(`${entity}: expected an array of records`);
      continue;
    }
    records.forEach((record, i) => {
      problems.push(
        ...validate(record, schema, { schemas, self: schema, at: `${entity}[${i}]` }),
      );
    });
  }
  return problems;
}

/** Validate every seed file in `dir` against the schema set. */
export function validateSeedDir(seedDir = SEED_DIR, schemas = loadSchemas()) {
  const problems = [];
  if (!fs.existsSync(seedDir)) return problems;
  for (const file of fs.readdirSync(seedDir).filter((f) => f.endsWith('.json'))) {
    const seed = JSON.parse(fs.readFileSync(path.join(seedDir, file), 'utf-8'));
    problems.push(...validateSeed(seed, schemas).map((p) => `${file}: ${p}`));
  }
  return problems;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const schemas = loadSchemas();
  const problems = validateSeedDir(SEED_DIR, schemas);
  if (problems.length) {
    console.error('reference data layer: seed validation failed');
    for (const p of problems) console.error(`  - ${p}`);
    process.exit(1);
  }
  console.log(
    `reference data layer: ${entityNames(schemas).length} entity schemas, seed valid`,
  );
}
