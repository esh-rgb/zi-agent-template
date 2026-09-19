import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (...p) => fs.readFileSync(path.join(root, ...p), 'utf-8');
const template = path.join(root, 'ops', 'zi');

/**
 * Documented counts drifted silently once already -- the README said 43 tests when
 * there were 56, and the CHANGELOG said nine skills when there were eleven. These
 * derive every number from the filesystem, so the next drift fails CI instead of
 * ageing into a wrong claim someone quotes.
 */

const WORDS = {
  1: 'one', 2: 'two', 3: 'three', 4: 'four', 5: 'five', 6: 'six', 7: 'seven',
  8: 'eight', 9: 'nine', 10: 'ten', 11: 'eleven', 12: 'twelve', 13: 'thirteen',
};

const counts = {
  skills: fs.readdirSync(path.join(template, 'skills')).length,
  tasks: fs.readdirSync(path.join(template, 'ai.nanoco.nanoclaw', 'tasks'))
    .filter((f) => f.endsWith('.md')).length,
  extras: fs.readdirSync(path.join(template, 'ai.nanoco.nanoclaw', 'context', 'additional_context'))
    .filter((f) => f.endsWith('.md')).length,
  specialists: fs.readdirSync(path.join(root, 'reference', 'specialists'))
    .filter((f) => f.endsWith('.md') && f !== 'README.md').length,
  connectorExamples: fs.readdirSync(path.join(root, 'connectors', 'examples')).length,
};

test('the template has the shape the docs describe', () => {
  assert.equal(counts.skills, 11);
  assert.equal(counts.tasks, 4);
  assert.equal(counts.extras, 12);
});

test('README states the skill count correctly', () => {
  const readme = read('README.md');
  const word = WORDS[counts.skills];
  assert.match(
    readme.toLowerCase(),
    new RegExp(`## ${word} skills`),
    `README's skill heading must say "${word}" -- there are ${counts.skills}`,
  );
});

test('every skill folder is named in the README list', () => {
  const readme = read('README.md');
  for (const skill of fs.readdirSync(path.join(template, 'skills'))) {
    assert.match(readme, new RegExp(`\`${skill}\``), `README does not list ${skill}`);
  }
});

test('the CHANGELOG names every skill it claims to have added', () => {
  const changelog = read('CHANGELOG.md');
  const word = WORDS[counts.skills];
  assert.match(
    changelog.toLowerCase(),
    new RegExp(`${word} skills`),
    `CHANGELOG must say "${word} skills"`,
  );
  for (const skill of fs.readdirSync(path.join(template, 'skills'))) {
    assert.match(changelog, new RegExp(`\`${skill}\``), `CHANGELOG does not name ${skill}`);
  }
});

test('architecture states the shipped counts correctly', () => {
  const arch = read('docs', 'architecture.md');
  assert.match(
    arch,
    new RegExp(`${WORDS[counts.skills]} skills, ${WORDS[counts.tasks]} paused scheduled tasks`, 'i'),
  );
});

/** Every documented test count must match what `node --test` actually runs. */
test('documented test counts match the suite', async () => {
  const files = fs.readdirSync(path.join(root, 'tests')).filter((f) => f.endsWith('.test.mjs'));
  // Count top-level `test(` calls; this suite has no nested subtests.
  let total = 0;
  for (const file of files) {
    const body = fs.readFileSync(path.join(root, 'tests', file), 'utf-8');
    total += (body.match(/^test\(/gm) ?? []).length;
    // defenses.test.mjs generates one test per attack from a table.
    const table = body.match(/const ATTACKS = \[([\s\S]*?)\n\];/);
    if (table) total += (table[1].match(/^\s*\['/gm) ?? []).length;
  }

  for (const [file, label] of [['README.md', 'README'], ['VM_ACCEPTANCE.md', 'VM_ACCEPTANCE'], ['CHANGELOG.md', 'CHANGELOG']]) {
    const claimed = read(file).match(/(\d+)\s+tests\b/);
    if (!claimed) continue;
    assert.equal(
      Number(claimed[1]),
      total,
      `${label} claims ${claimed[1]} tests; the suite defines ${total}`,
    );
  }
});

// --- specialists: the list is closed, in both directions ---

test('every specialist in the closed list has a definition, and none exists outside it', () => {
  const orchestration = read(
    'ops/zi/ai.nanoco.nanoclaw/context/additional_context/orchestration.md',
  );
  const section = orchestration.split('## Specialists Zi may route to')[1].split('\n\n')[2];
  const declared = [...section.matchAll(/`([a-z]+)`/g)].map((m) => m[1]).sort();
  const defined = fs
    .readdirSync(path.join(root, 'reference', 'specialists'))
    .filter((f) => f.endsWith('.md') && f !== 'README.md')
    .map((f) => f.replace(/\.md$/, ''))
    .sort();

  assert.deepEqual(defined, declared, 'reference/specialists must match the closed list exactly');
  assert.equal(declared.length, 9);
});

test('every specialist definition carries the five headings and inherits approval', () => {
  const dir = path.join(root, 'reference', 'specialists');
  for (const file of fs.readdirSync(dir).filter((f) => f.endsWith('.md') && f !== 'README.md')) {
    const body = fs.readFileSync(path.join(dir, file), 'utf-8');
    for (const heading of ['Job', 'Receives', 'Tools', 'Approval', 'Refuses', 'Deploy as']) {
      assert.match(body, new RegExp(`\\*\\*${heading}`), `${file} is missing **${heading}**`);
    }
    // Delegation never widens permission -- a definition must not invent a level.
    assert.doesNotMatch(body, /Level [A-D] instead of|lower(s)? (the |its )?approval/i, `${file} lowers an approval level`);
  }
});

// --- connector examples ---

test('every connector example is a complete declaration', () => {
  const dir = path.join(root, 'connectors', 'examples');
  for (const file of fs.readdirSync(dir)) {
    const body = fs.readFileSync(path.join(dir, file), 'utf-8');
    for (const field of ['name:', 'capabilities:', 'required_secrets:', 'approval_class:', 'risk_class:', 'health:']) {
      assert.match(body, new RegExp(`^${field}`, 'm'), `${file} is missing ${field}`);
    }
    assert.match(body.match(/^approval_class:\s*(\S+)/m)[1], /^[ABCD]$/, `${file} has a bad approval_class`);
    assert.match(
      body.match(/^risk_class:\s*(\S+)/m)[1],
      /^(reversible|hard_to_reverse|irreversible)$/,
      `${file} has a bad risk_class`,
    );
    // Rule 7 of the contract: no credential ever appears in an example.
    assert.match(body, /^required_secrets:\s*\[\]/m, `${file} must declare no secrets`);
  }
});

test('the connector contract indexes every example it ships', () => {
  const contract = read('connectors', 'contract', 'README.md');
  for (const file of fs.readdirSync(path.join(root, 'connectors', 'examples'))) {
    assert.match(contract, new RegExp(file.replace('.md', '')), `contract does not index ${file}`);
  }
});

// --- links ---

test('every relative doc link resolves', () => {
  const docs = ['README.md', 'CONTRIBUTING.md', 'CHANGELOG.md', 'VM_ACCEPTANCE.md']
    .concat(fs.readdirSync(path.join(root, 'docs')).filter((f) => f.endsWith('.md')).map((f) => `docs/${f}`))
    .concat(fs.readdirSync(path.join(root, 'reference')).map((d) => `reference/${d}/README.md`));

  for (const doc of docs) {
    const body = read(doc);
    const from = path.dirname(path.join(root, doc));
    for (const [, target] of body.matchAll(/\]\(([^)#:]+?)\)/g)) {
      if (target.startsWith('http')) continue;
      assert.ok(
        fs.existsSync(path.resolve(from, target)),
        `${doc} links to ${target}, which does not exist`,
      );
    }
  }
});
