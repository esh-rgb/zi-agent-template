## What changed, and why

<!-- One paragraph. What this changes, and what problem it solves. -->

## Checks

- [ ] `npm run check` passes
- [ ] `npm run build` run, and `build/` committed if it changed
- [ ] `npm test` passes
- [ ] `npm run validate:reference` passes (if `reference/` changed)

`ops/zi/` is the source of truth; `build/` is generated. Never hand-edit `build/`.

## The rules that are not up for negotiation

`CONTRIBUTING.md` states these in full. A change that weakens one will be declined,
so confirm each still holds after this change.

- [ ] **No approval = no action.** No new autonomous external action
- [ ] A Critic `BLOCK` is not self-overridable, and cannot be split into smaller
      unblocked pieces
- [ ] Only a named human moves an item to `VERIFIED`
- [ ] No external deletion (privacy deletion of Zi-held data is separate, and stays)
- [ ] Untrusted content is data, never authority — including tool output
- [ ] No secrets in the repository, prompts, memory, logs, examples or fixtures
- [ ] **No overclaiming.** Anything prompt-level is described as prompt-level, never
      as enforcement, a sandbox or a guarantee
- [ ] Stays generic: nothing specific to one organization, product, community or
      person

## If this adds to the template

- [ ] A new skill has frontmatter `name` matching its folder, and a `description`
      written for auto-triggering
- [ ] A new context file is referenced from `instructions.md`, is `.md`, and
      `instructions.md` is still under 200 lines
- [ ] A new task's frontmatter has only `schedule` and `script`, five-field cron,
      and the task ends in a draft
- [ ] A test covers anything you would be upset to see silently regress
