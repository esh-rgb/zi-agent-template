---
name: Bug report
about: Something behaves differently from what the template says it does
title: ''
labels: bug
assignees: ''
---

## What happened

<!-- What you saw. If it involves the agent, paste the prompt you actually used
     and the response you actually got. A summary is not evidence. -->

## What the template says should happen

<!-- Quote the file and line: instructions.md, a SKILL.md, approval-policy.md,
     verification.md, the trust model. -->

## Environment

- Layout: canonical (`ops/zi`) / legacy (`build/legacy/zi`)
- NanoClaw commit:
- Node version:
- Channel:
- Context: operator group / member group

## Before you file

- [ ] Both contexts are separate agent groups wired to separate chats
- [ ] The agent knows which context it is
- [ ] `npm run check` and `npm test` pass on this checkout

Note: behavioral controls are not enforcement, and that is documented rather than
broken — `docs/trust-model.md`. A model that can be argued into something is a
finding worth having, and it belongs in `VM_ACCEPTANCE.md` too, with the exact
prompt and response.
