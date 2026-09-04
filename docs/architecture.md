# Architecture

Zi is a NanoClaw Agent Template: instructions, skills, MCP declarations and
scheduled tasks. It ships no runtime code. Everything below describes how those
pieces compose, and where the actual enforcement lives.

## Shape

```
person (member / operator / trusted source)
        │
   channel adapter            installed by a NanoClaw channel skill
        │
   NanoClaw router            resolves user → messaging group → agent group → session
        │
   ┌────┴─────────────────┐
   │                      │
Zi Operator group     Zi Member group      ← two agent groups: the real boundary
   │                      │
   └────┬─────────────────┘
        │
   Zi core instructions                    always in the prompt
        │
   trust-boundary                          classify origin, strip authority
        │
   skill selection                         by SKILL.md description
        │
   draft or recommendation
        │
   Critic checklist                        PASS | PASS_WITH_NOTE | REVISE | BLOCK
        │
   approval gate                           Level A / B / C / D
        │
   connector                               scoped authorization, credential proxy
        │
   audit + memory update
```

## Composition at spawn

NanoClaw regenerates each group's `CLAUDE.md` on every spawn. The template's
`instructions.md` is staged as `instructions.prepend.md` and sits at system-prompt
tier; skills are copied into the group's own overlay; extra context files land in the
workspace at the same relative paths they had under `context/`.

Nothing under `context/` is auto-injected — the agent reads an extra file only
because `instructions.md` points at it. A CI test enforces that every extra file is
referenced, so nothing ships dead.

## One persona, two layouts

```
community/zi/                     canonical — Agent Plugins 1.0.0
      │  scripts/export-legacy.mjs (byte-for-byte copy, no rewriting)
      ▼
build/legacy/zi/                  for NanoClaw installs predating Agent Plugins
```

The legacy export exists because installs before Agent Plugins support key off
`context/instructions.md` at the template root, while current ones key off
`plugin.json` and read the `ai.nanoco.nanoclaw/` extension directory. Two layouts,
one source: the export copies bytes and never rewrites text, and a test asserts the
instructions are byte-identical across both. Never edit `build/`.

## Contexts

| | Operator group | Member group |
|---|---|---|
| Serves | the people running the community | one individual |
| Memory | community knowledge, queues, sources | that person's preferences and history |
| Approvals | can approve at their role's level | confirms their own Level B actions |
| Sees member private data | no | their own only |

An operator group models a *team* — roles, per-role permissions, and per-human
attribution on every action. Shared context never implies shared permission.

## Skills

Loaded by description, not by name. Each is a procedure the instructions delegate to:

`trust-boundary` gates untrusted input · `trusted-source-verification` moves items
through the status model · `community-brain` decides what is worth remembering ·
`content-adapter` renders one core per channel · `human-handoff` routes to a person ·
`calendar-action` is the worked Level B connector flow · `referral-directory`
recommends with consent · `privacy-controls` serves data rights · `budget-awareness`
keeps cost proportionate.

The **Critic is deliberately not a skill.** A skill only runs when it triggers; the
Critic must run on every external action, so it lives in the always-loaded
instructions and in `approval-policy.md`.

## Specialists

There are none, and that is a decision. A separate agent earns its existence only
with a distinct trust boundary, tool set, or responsibility. Splitting Zi into a
roster of named personas would add orchestration surface and a second identity for
the user to track without adding a single boundary. One Zi with skills.

## Where enforcement actually lives

| Control | Enforced by | Strength |
|---|---|---|
| Operator/member isolation | NanoClaw agent groups and sessions | Runtime |
| Credential secrecy | credential proxy, host-matched injection | Runtime |
| Tool availability | container MCP configuration | Runtime |
| Tasks start paused | NanoClaw template stamping | Runtime |
| Cron frequency limit | NanoClaw scheduling | Runtime |
| Approval gates, Critic, verification, budget, injection defenses | instructions and skills | Behavioral |

Behavioral controls are real and they are the majority of this template. They are
not access control. `docs/trust-model.md` states the consequences plainly.
