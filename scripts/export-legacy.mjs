#!/usr/bin/env node
/**
 * Generate the legacy NanoClaw template layout from the canonical Agent Plugins
 * source, so one persona serves both.
 *
 *   canonical  community/zi/{plugin.json,mcp.json,skills/,ai.nanoco.nanoclaw/{context,tasks}}
 *   legacy     build/legacy/zi/{.mcp.json,skills/,context/,tasks/}
 *
 * The legacy layout is what NanoClaw forks predating Agent Plugins support parse
 * (they require context/instructions.md at the template root). Content is copied
 * byte for byte -- this script never rewrites text, so the two layouts cannot
 * drift in wording. build/ is generated: never hand-edit it.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const CANONICAL = path.join(root, 'community', 'zi');
export const LEGACY = path.join(root, 'build', 'legacy', 'zi');

/** Copy a file, creating parent directories. Byte-identical, no transformation. */
function copyFile(from, to) {
  fs.mkdirSync(path.dirname(to), { recursive: true });
  fs.copyFileSync(from, to);
}

/** Recursively copy a directory if it exists. */
function copyDir(from, to) {
  if (!fs.existsSync(from)) return;
  fs.mkdirSync(to, { recursive: true });
  fs.cpSync(from, to, { recursive: true });
}

/**
 * Write the legacy layout under `outRoot` (default: the committed build/legacy).
 * Tests pass a temp directory so verifying the export never mutates the tree other
 * test files are concurrently reading.
 */
export function exportLegacy(outRoot = path.join(root, 'build', 'legacy')) {
  const out = path.join(outRoot, 'zi');
  fs.rmSync(out, { recursive: true, force: true });
  fs.mkdirSync(out, { recursive: true });

  const nc = path.join(CANONICAL, 'ai.nanoco.nanoclaw');

  // context/ moves from the extension dir to the template root
  copyDir(path.join(nc, 'context'), path.join(out, 'context'));
  copyDir(path.join(nc, 'tasks'), path.join(out, 'tasks'));
  copyDir(path.join(CANONICAL, 'skills'), path.join(out, 'skills'));

  // mcp.json -> .mcp.json (the legacy parser reads the dotted name)
  const mcp = path.join(CANONICAL, 'mcp.json');
  if (fs.existsSync(mcp)) copyFile(mcp, path.join(out, '.mcp.json'));

  const readme = path.join(CANONICAL, 'README.md');
  if (fs.existsSync(readme)) copyFile(readme, path.join(out, 'README.md'));

  fs.writeFileSync(
    path.join(outRoot, 'README.md'),
    [
      '# Generated — do not edit',
      '',
      'Legacy-layout export of `community/zi`, for NanoClaw installs that predate',
      'Agent Plugins template support. Regenerate with `node scripts/export-legacy.mjs`.',
      'Edit the canonical source under `community/zi/` instead; edits here are',
      'overwritten and will fail the sync test.',
      '',
      'Stamp it with:',
      '',
      '```bash',
      'NANOCLAW_TEMPLATES_DIR="$PWD/build/legacy" ncl groups create --template zi --name "Zi Operator"',
      '```',
      '',
    ].join('\n'),
  );
  return out;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  exportLegacy();
  console.log(`legacy export written to ${path.relative(root, LEGACY)}`);
}
