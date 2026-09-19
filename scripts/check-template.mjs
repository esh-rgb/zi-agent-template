#!/usr/bin/env node
/**
 * Structural validation of the Zi template against both the Agent Plugins 1.0.0
 * layout and the constraints NanoClaw's template parser enforces at stamp time.
 * Mirrors the registry's own check-templates.mjs on the rules we can verify
 * locally, so a submission cannot fail on something we could have caught here.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TEMPLATE = path.join(root, 'ops', 'zi');

const SCHEMA = 'https://agent-plugins.org/schemas/1.0.0/plugin.schema.json';
const NAME_RE = /^[a-z0-9](?:[a-z0-9.-]{0,62}[a-z0-9])?$/;
const CREDENTIAL_KEY = /(TOKEN|SECRET|PASSWORD|API_?KEY|CREDENTIAL|PRIVATE_?KEY|AUTH)/i;
const INSTRUCTIONS_MAX_LINES = 200;
const SKILL_MAX_LINES = 500;

/** Collect problems rather than throwing, so one run reports everything. */
const problems = [];
const fail = (msg) => problems.push(msg);
const lines = (file) => fs.readFileSync(file, 'utf-8').split(/\r?\n/).length;

function checkManifest() {
  const file = path.join(TEMPLATE, 'plugin.json');
  if (!fs.existsSync(file)) return fail('plugin.json is missing (it is the discovery marker)');
  let manifest;
  try {
    manifest = JSON.parse(fs.readFileSync(file, 'utf-8'));
  } catch (err) {
    return fail(`plugin.json is not valid JSON: ${err.message}`);
  }
  if (manifest.$schema !== SCHEMA) fail(`plugin.json $schema must be exactly ${SCHEMA}`);
  if (typeof manifest.name !== 'string' || !NAME_RE.test(manifest.name)) {
    fail('plugin.json name must be 1-64 lowercase alphanumerics, hyphens and periods');
  }
  if (manifest.name?.includes('--') || manifest.name?.includes('..')) {
    fail('plugin.json name must not contain -- or .. runs');
  }
}

/** No credential-shaped value may be anything but the literal "placeholder". */
function checkMcp() {
  const file = path.join(TEMPLATE, 'mcp.json');
  if (!fs.existsSync(file)) return;
  let mcp;
  try {
    mcp = JSON.parse(fs.readFileSync(file, 'utf-8'));
  } catch (err) {
    return fail(`mcp.json is not valid JSON: ${err.message}`);
  }
  const walk = (node, trail) => {
    if (!node || typeof node !== 'object') return;
    for (const [key, value] of Object.entries(node)) {
      if (typeof value === 'object') walk(value, `${trail}.${key}`);
      else if (CREDENTIAL_KEY.test(key) && value !== 'placeholder') {
        fail(`mcp.json ${trail}.${key} looks credential-shaped and must be "placeholder"`);
      }
    }
  };
  walk(mcp.mcpServers ?? {}, 'mcpServers');
}

function checkInstructions() {
  const dir = path.join(TEMPLATE, 'ai.nanoco.nanoclaw', 'context');
  const file = path.join(dir, 'instructions.md');
  if (!fs.existsSync(file)) return fail('ai.nanoco.nanoclaw/context/instructions.md is missing');
  const body = fs.readFileSync(file, 'utf-8');
  if (!body.trim()) return fail('instructions.md is empty');
  if (lines(file) > INSTRUCTIONS_MAX_LINES) {
    fail(`instructions.md is ${lines(file)} lines; keep it under ${INSTRUCTIONS_MAX_LINES}`);
  }

  // Nothing under context/ is auto-injected: an unreferenced extra file is dead weight.
  const extras = fs
    .readdirSync(dir, { recursive: true })
    .filter((f) => f.endsWith('.md') && f !== 'instructions.md');
  for (const extra of extras) {
    const ref = extra.split(path.sep).join('/');
    if (!body.includes(ref)) fail(`${ref} is never referenced from instructions.md`);
    if (!ref.endsWith('.md')) fail(`${ref} will not be copied: only .md files under context/ are`);
  }
  // Non-markdown under context/ is silently dropped by the parser.
  for (const f of fs.readdirSync(dir, { recursive: true })) {
    const abs = path.join(dir, f);
    if (fs.statSync(abs).isFile() && !f.endsWith('.md')) {
      fail(`context/${f} is not .md and will not be copied into the agent workspace`);
    }
  }
}

function checkSkills() {
  const dir = path.join(TEMPLATE, 'skills');
  if (!fs.existsSync(dir)) return;
  for (const name of fs.readdirSync(dir)) {
    const skill = path.join(dir, name, 'SKILL.md');
    if (!fs.existsSync(skill)) {
      fail(`skills/${name} has no SKILL.md`);
      continue;
    }
    const body = fs.readFileSync(skill, 'utf-8');
    if (!body.startsWith('---\n')) fail(`skills/${name}/SKILL.md needs YAML frontmatter`);
    const close = body.indexOf('\n---', 4);
    const front = close === -1 ? '' : body.slice(4, close);
    if (!/^name:\s*\S/m.test(front)) fail(`skills/${name}/SKILL.md frontmatter needs name`);
    if (!/^description:\s*\S/m.test(front)) {
      fail(`skills/${name}/SKILL.md frontmatter needs description (it drives auto-trigger)`);
    }
    const declared = front.match(/^name:\s*(\S+)/m)?.[1];
    if (declared && declared !== name) {
      fail(`skills/${name}/SKILL.md declares name "${declared}"; it must match the folder`);
    }
    if (lines(skill) > SKILL_MAX_LINES) {
      fail(`skills/${name}/SKILL.md is ${lines(skill)} lines; keep it under ${SKILL_MAX_LINES}`);
    }
  }
}

/** Frontmatter accepts only schedule and script -- anything else aborts the stamp. */
function checkTasks() {
  const dir = path.join(TEMPLATE, 'ai.nanoco.nanoclaw', 'tasks');
  if (!fs.existsSync(dir)) return;
  for (const file of fs.readdirSync(dir).filter((f) => f.endsWith('.md'))) {
    const body = fs.readFileSync(path.join(dir, file), 'utf-8').split(/\r?\n/);
    if (body[0] !== '---') {
      fail(`tasks/${file} must open with --- frontmatter`);
      continue;
    }
    const close = body.indexOf('---', 1);
    if (close === -1) {
      fail(`tasks/${file} is missing the closing ---`);
      continue;
    }
    const keys = body
      .slice(1, close)
      .filter((l) => /^\w[\w-]*:/.test(l))
      .map((l) => l.split(':')[0]);
    for (const key of keys) {
      if (key !== 'schedule' && key !== 'script') {
        fail(`tasks/${file} frontmatter accepts only schedule and script, found "${key}"`);
      }
    }
    if (!keys.includes('schedule')) fail(`tasks/${file} is missing a schedule`);
    const schedule = body.slice(1, close).find((l) => l.startsWith('schedule:'));
    const cron = schedule?.slice('schedule:'.length).trim().replace(/^["']|["']$/g, '');
    if (!cron || cron.split(/\s+/).length !== 5) {
      fail(`tasks/${file} schedule must be a 5-field cron expression, got "${cron ?? ''}"`);
    }
    if (!body.slice(close + 1).join('\n').trim()) fail(`tasks/${file} has an empty prompt body`);
  }
}

checkManifest();
checkMcp();
checkInstructions();
checkSkills();
checkTasks();

if (problems.length) {
  console.error('template check failed:');
  for (const p of problems) console.error(`  - ${p}`);
  process.exit(1);
}
console.log('template check passed');
