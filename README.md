# Zi — a community agent for NanoClaw

**Zi is an installable AI community teammate.** It learns your community's context,
curates knowledge and events, verifies before stating anything as fact, writes
channel-aware drafts, helps individual members, runs recurring routines, and keeps
every sensitive action behind a human approval.

One identity. Two contexts: the people who **run** the community, and each
**member** who uses it.

Works for professional, local, creator, open-source, customer, employee, nonprofit,
alumni, relocation and interest communities. Nothing in it is specific to any one
community or organization.

## Install

```bash
git clone https://github.com/esh-rgb/zi-agent-template
cp -r zi-agent-template/community/zi /path/to/nanoclaw/templates/community/zi

ncl groups create --template community/zi --name "Zi Operator"
ncl groups create --template community/zi --name "Zi Member"
```

On a NanoClaw install predating Agent Plugins support, point at the generated legacy
layout instead:

```bash
NANOCLAW_TEMPLATES_DIR="$PWD/build/legacy" ncl groups create --template zi --name "Zi Operator"
```

Full steps, including how to tell which layout your install needs:
[`docs/vm-deployment.md`](docs/vm-deployment.md).

## Then tell it about your community

```
This is my community.
This is what we care about.
These are our channels.
These are the people who can approve things.
These are the trusted sources.
These are the things Zi may do.
```

Conversationally, or by pasting the blocks from `config-example.md`. Zi has no
community until you give it one — it asks rather than inventing.

## The rule that matters

```
Observe → Understand → Draft → Critic → Human approval → Connector → Execute → Audit
```

> **No approval = no action.**

Zi drafts; a human sends. Zi does not delete external things. A scheduled task
firing is not an approval. An unverified item is never presented as fact.

## What it does

**For operators** — community briefing · trusted-source intake · event verification ·
knowledge curation · channel-aware drafts · content repurposing · referral and
resource management · human routing · follow-up · recurring routines.

**For members** — answers from approved knowledge · relevant events and resources ·
explained recommendations · "add this to my calendar" with explicit confirmation ·
human help on request · full control over what Zi remembers.

## Nine skills

`trust-boundary` · `trusted-source-verification` · `community-brain` ·
`content-adapter` · `human-handoff` · `calendar-action` · `referral-directory` ·
`privacy-controls` · `budget-awareness`

The Critic is deliberately **not** a skill — it lives in the always-loaded
instructions so it cannot be skipped by failing to trigger.

## Honest limits

Read this before relying on it.

- **Isolation is real, and it comes from NanoClaw** — two agent groups, two
  workspaces, two memories. Put both contexts in one group and you remove the only
  hard boundary in the design.
- **Approval gates, the Critic, verification, budgets and injection defenses are
  instructions and skills.** Strong influence on behavior, genuine defense in depth
  — but not a sandbox, not access control, not a guarantee.
- **No hard budget enforcement.** NanoClaw provides no token or cost cap, so nothing
  here can hard-stop a request. Budget behavior is guidance and logging.
- **No compliance claim.** `docs/legal/` holds engineering templates that require
  legal review. Installing Zi does not make anyone GDPR-compliant.
- **No credentials.** This template declares no MCP servers and needs no keys.
  Channels and tools are installed by NanoClaw's own skills.
- Zi writes video scripts. It does not produce video.

[`docs/trust-model.md`](docs/trust-model.md) states all of this in full.

## Docs

| | |
|---|---|
| [Architecture](docs/architecture.md) | How the pieces compose, and where enforcement lives |
| [Trust model](docs/trust-model.md) | Guaranteed vs. behavioral, threats in and out of scope |
| [VM deployment](docs/vm-deployment.md) | Exact install steps and troubleshooting |
| [Demo scenarios](docs/demo-scenarios.md) | Five flows plus ten adversarial probes |
| [Connector contract](connectors/contract/README.md) | How a connector must be declared |
| [Legal templates](docs/legal/) | Eleven engineering templates for review |

## Develop

```bash
npm run check   # structural validation against both layouts
npm run build   # regenerate build/legacy from the canonical source
npm test        # 43 tests: structure, sync, secrets, defenses, policy invariants
```

`community/zi/` is the source of truth. `build/` is generated — never edit it.

## Make it yours

Replace `display_name` and `mascot_name` in the brand block with your own name and
mascot. Behavior, including AI disclosure, is unchanged.

## License

MIT. See [`LICENSE`](LICENSE), [`LICENSE_AUDIT.md`](LICENSE_AUDIT.md) and
[`THIRD_PARTY_NOTICES.md`](THIRD_PARTY_NOTICES.md).
