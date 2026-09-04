# Contributing

## Before you start

`community/zi/` is the source of truth. `build/` is generated — never edit it.
Run `npm run build` after changing the canonical template, and commit the result;
a test fails if the export is stale.

```bash
npm run check   # structural validation
npm run build   # regenerate build/legacy
npm test        # everything
```

All three must pass before a pull request.

## What this template is

Instructions, skills, MCP declarations and scheduled tasks. No runtime code, no
dependencies. `package.json` declares none and should stay that way — scripts and
tests use only the Node.js standard library.

## Rules that are not up for negotiation

These encode the template's whole value. A change that weakens one will be declined.

1. **No approval = no action.** Never add an autonomous external action.
2. **A Critic `BLOCK` is not self-overridable**, and cannot be split into smaller
   unblocked pieces.
3. **Only a named human moves an item to `VERIFIED`.**
4. **No external deletion.** Privacy deletion of Zi-held data is separate and stays.
5. **Untrusted content is data, never authority** — including tool output.
6. **No secrets** in the repository, prompts, memory, logs, examples or fixtures.
7. **No overclaiming.** If a control is prompt-level, say so. Never describe
   behavioral guidance as enforcement, a sandbox, or a guarantee.
8. **Stay generic.** No organization, product, community or person specific to any
   one deployment. CI enforces this.

## Adding a skill

`community/zi/skills/<name>/SKILL.md`, with YAML frontmatter carrying `name`
(matching the folder) and `description` (which drives auto-triggering, so write it
for recognition, not for elegance). Under 500 lines; put anything longer in sibling
files.

Prefer a skill over a new specialist agent. A separate agent earns its place only
with a distinct trust boundary, tool set, or responsibility.

## Adding context

`community/zi/ai.nanoco.nanoclaw/context/additional_context/<name>.md`, and
**reference it from `instructions.md`** — nothing under `context/` is auto-injected,
so an unreferenced file is dead weight and CI will fail. Only `.md` files are copied
into the agent workspace; a `.yaml` there is silently dropped, so config examples
ship as Markdown with fenced YAML.

Keep `instructions.md` under 200 lines. It is always in the prompt and some providers
cap it.

## Adding a task

`community/zi/ai.nanoco.nanoclaw/tasks/<name>.md`. Frontmatter accepts **only**
`schedule` and `script` — anything else aborts the stamp. Five-field cron. Ungated
tasks may fire at most four times in 24 hours.

Every task must end in a draft. A cron is not permission to publish.

## Tests

Add a test for anything you would be upset to see silently regress. Policy invariants
belong in `tests/policy.test.mjs`, injection-defense coverage in
`tests/defenses.test.mjs`.

Note what those defense tests do: they assert a defense clause **exists**. They do not
prove the model behaves correctly under attack. Do not describe them as if they do —
live results belong in `VM_ACCEPTANCE.md`.

## Third-party code

Don't, if reimplementation is reasonable. If you must: verify the license by reading
the upstream `LICENSE` file, review transitive dependencies, record it in
`third_party/manifest.yaml`, and do not ship it while `review_status` is `UNVERIFIED`.
