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
ops/zi/                     canonical — Agent Plugins 1.0.0
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

## Orchestration

Zi is the main assistant and orchestrator. It resolves intent, loads only what
that intent needs, delegates to a specialist where one is configured, and returns
one answer in one voice.

```
intent
 → skill + specialist + tools + context selected for THIS task
 → specialist executes with references, not transcripts
 → results composed back into a single Zi reply
```

Four things stay separate and are never collapsed into each other:

| Layer | Is | Is not |
|---|---|---|
| Skills | knowledge and procedure | an agent |
| Specialists | deciders and executors | a rule |
| Tools | external actions | a fact |
| Data | the shared source of truth | a conversation |

**Specialists Zi may route to:** `community`, `events`, `content`, `partner`,
`matching`, `publishing`, `moderation`, `crm`, `analytics`. Deliberately a short,
closed list — a new job title is a reason for a skill, not a new agent. Where a
specialist is not configured, Zi does the work itself with the relevant skill.

**This reverses an earlier decision.** Through Round 4 this template shipped no
specialists at all, on the reasoning that a second agent earns its existence only
with a distinct trust boundary, tool set or responsibility. That reasoning still
holds and is exactly why the list is closed and short. What changed is the
product target: Zi is now specified as an orchestration layer, so routing is part
of the design rather than avoidable complexity.

## Just-in-time context

Context is fetched, not carried. Skills load when a task needs them. Tools are
discovered per task rather than exposed globally. Specialists receive `user_id`,
`event_id`, `community_id` and the like — never the chat history, never another
community's data.

The practical payoff is the same as the trust payoff: a specialist that never
received the transcript cannot leak it.

## Community data layer

Structured records are the source of truth — `Person`, `Organization`,
`Community`, `Event`, `Opportunity`, `Need`, `Offer`, `Content`, `Conversation`,
`Location`, `Relationship`, `Permission`/`Consent`, `Task`. Full schema:
`ops/zi/ai.nanoco.nanoclaw/context/additional_context/data-layer.md`.

The template ships the **contract**, not the store. See "Locked and open" below.

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

## Locked and open

The product target is an orchestration layer for community intelligence, action
and connection. A NanoClaw template ships instructions, skills, MCP declarations
and scheduled tasks — it ships no application code. That line decides which of
the following is real today and which is a contract waiting for an implementation.

### Locked — shipped and verified in this repo

- One Zi identity; operator and member as separate NanoClaw agent groups.
- Orchestrator model: intent → skill/specialist/tools/context → one composed answer.
- Just-in-time context; references passed to specialists, never transcripts.
- Tool discovery as a discipline: narrow to the task before acting.
- The four-layer separation of skills, specialists, tools and data.
- Approval levels A–D, `No approval = no action`, non-overridable Critic `BLOCK`.
- Verification status model; only a named human reaches `VERIFIED`.
- Untrusted-content contract and its named defenses.
- Consent required before personal data crosses to anyone.
- Memory classes: user, conversation, operational state, community knowledge.
- Eleven skills, four paused scheduled tasks, both template layouts in sync.

### Open — contract defined, implementation not shipped

- **The community data layer.** Schema and rules are specified; the store is not.
  An operator wires one (MCP server, API, or a maintained file at small scale).
  Until then Zi works from conversation and memory, and says so.
- **Specialist agents as separate runtimes.** The routing model and the closed
  list are defined. Whether each specialist is a distinct NanoClaw agent group or
  a skill Zi runs itself is an operator's deployment choice. Nothing in the
  template forces either.
- **Shared state across specialists.** NanoClaw isolates agent groups by design;
  it provides no shared store between them. Cross-specialist state therefore
  depends entirely on the data layer above — which is also why that layer is the
  one deliberate crossing of the isolation boundary. See `trust-model.md`.
- **The activation surface.** The short onboarding flow and the deep link into a
  chat channel are specified in `onboarding.md` as a contract. They are a web app
  and cannot ship inside a template. Zi's side — arriving in context and never
  re-asking — is implemented.
- **Tool discovery as a mechanism.** Today it is a discipline Zi follows, not a
  runtime that filters a registry before the model sees it.
- **Cross-channel identity.** One `user_id` across channels is specified. The
  linking service that guarantees it is not part of the template.

### Success measure

Not "profile completed". **Time to first community value** — from discovery
through onboarding to a relevant recommendation or a completed action. A finished
profile that produced nothing is a failed onboarding.
