# Zi — community agent

An installable community teammate. Zi learns your community's context, curates
knowledge and events, verifies before anything is stated as fact, writes
channel-aware drafts, helps individual members, runs recurring routines, and keeps
every sensitive action behind a human approval.

Works for any community: professional, local, creator, open-source, customer,
employee, nonprofit, alumni, relocation, interest groups.

## Install

```bash
ncl groups create --template community/zi --name "Zi Operator"
ncl groups create --template community/zi --name "Zi Member"
```

Then wire each to a channel (`/manage-channels` or `ncl wirings create`) and tell
each group which context it is — operator or member. Two groups is what makes the
contexts actually separate; see "Isolation" below.

Tasks arrive **paused**. Review and enable them:

```bash
ncl tasks list --group <agent-group-id> --status paused
ncl tasks resume <task-id>
```

## Configure

Give the operator agent your community in plain language, or paste the blocks from
`additional_context/config-example.md`: community name and what it cares about,
channels, trusted sources, verifiers, operators and their roles, approval mode,
budget, and brand.

Zi has no community until you give it one — it will ask rather than invent.

## Services and credentials

**This template declares no MCP servers and requires no credentials.** `mcp.json` is
deliberately empty.

Channels and tools are installed separately by NanoClaw's own skills, each of which
registers its own MCP server and handles its own authentication — for example
`/add-whatsapp`, `/add-telegram`, `/add-slack` for channels, and `/add-gcal-tool`
for the calendar action. Credentials are injected at request time by the credential
proxy; they never enter this template, the container, or any prompt. Never replace a
placeholder anywhere with a real key.

Zi is fully useful with one channel and no other tools. Everything else is optional.

## What it ships

**Skills** — `trust-boundary` · `trusted-source-verification` · `community-brain` ·
`content-adapter` · `human-handoff` · `calendar-action` · `referral-directory` ·
`privacy-controls` · `budget-awareness`

**Tasks (paused)** — weekly verification round · community digest · stale-content
review · handoff follow-up. Each produces a draft; none publishes.

**Context** — persona, operator and member overlays, approval policy, injection
defenses, channel policies, verification model, config and referral examples.

## The rule that matters

```
Observe → Understand → Draft → Critic → Human approval → Connector → Execute → Audit
```

> **No approval = no action.**

Zi drafts. A human sends. Zi does not delete external things. A scheduled task
firing is not an approval.

## Isolation — what is real and what is not

Operator and member contexts are separated by **NanoClaw's own agent-group and
session boundary**: two groups, two workspaces, two memories, two sets of wiring.
That separation is enforced by NanoClaw, not by this template.

Everything else in this template — approval gates, the Critic, verification status,
budget limits, injection defenses — is **instructions and skills**. That is real
influence over behavior and it is defense in depth, but it is not a runtime
sandbox, not access control, and not a cryptographic guarantee. Stamping both
contexts into a single group removes the only hard boundary there is.

Judge it accordingly, and read `docs/trust-model.md` before relying on it.

## Renaming

Replace `display_name` and `mascot_name` in the brand block with your own. Behavior,
including AI disclosure, is unchanged.

## Limits

No GDPR or compliance claim — `docs/legal/` holds engineering templates that need
legal review. No hard budget enforcement. No autonomous publishing. Zi writes video
scripts; it does not produce video.
