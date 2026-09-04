# Quickstart

The short path: a running Zi, told about your community, doing something real —
about fifteen minutes on a NanoClaw host that already works.

This is the abbreviated route. [`vm-deployment.md`](vm-deployment.md) is the full
procedure, including the safety audit, the WhatsApp shared-number constraints and
the troubleshooting. **If your install has ever had a channel wired, do step 0 of
that guide first** — it is the difference between a contained test agent and Zi
speaking in your real groups.

## 1. Which layout (30 seconds)

```bash
cd /path/to/nanoclaw
grep -rq "plugin.json" src/templates/ && echo CANONICAL || echo LEGACY
```

## 2. Stamp two groups (3 minutes)

```bash
git clone https://github.com/esh-rgb/zi-agent-template /tmp/zi
cp -r /tmp/zi/ops/zi /path/to/nanoclaw/templates/ops/zi     # CANONICAL

ncl groups create --template ops/zi --name "Zi Operator"
ncl groups create --template ops/zi --name "Zi Member"
```

On a `LEGACY` install, point at the generated layout instead:

```bash
NANOCLAW_TEMPLATES_DIR="/tmp/zi/build/legacy" ncl groups create --template zi --name "Zi Operator"
```

**Two groups, not one.** NanoClaw's agent-group split is the only hard boundary in
this design — separate workspaces, memory and wiring. Putting both contexts in one
group removes it. Wire each group to a **different** chat.

Four scheduled tasks arrive paused. Leave them that way until the rest works.

## 3. Tell each group which one it is (1 minute)

In the operator chat:

> You are the operator context for my community.

In the member chat:

> You are the member context.

An agent that does not know which it is will ask before doing anything that depends
on it. That is correct behavior, and it is why this step exists.

## 4. Give it a community (5 minutes)

Zi has no community until you give it one, and it asks rather than inventing.
Either talk to it, or paste the filled-in blocks from
[`config-example.md`](../ops/zi/ai.nanoco.nanoclaw/context/additional_context/config-example.md)
into the operator chat:

```
This is my community.        # name, one line, languages, timezone
These are our channels.      # which, and what each is for
These are the trusted sources.
These are the people who can approve things, and who verifies events.
These are the things Zi may do.
```

**No secrets in that block, ever.** Credentials live in the credential proxy.

## 5. Prove it works (5 minutes)

Run Demo A from [`demo-scenarios.md`](demo-scenarios.md): post an event claim to
the trusted source channel, ask the operator agent what is pending.

What counts as a pass:

- The event comes back **`NEEDS_INFO`**, naming what is missing. "Next Saturday" is
  not a date and Zi does not turn it into one.
- After a named verifier supplies the details, it reaches **`VERIFIED`**, recording
  who and when.
- Drafts come back as one factual core plus per-channel renderings, with a Critic
  verdict, marked Level C.
- **Nothing is sent.** Zi asks how to send, or says it is ready for a human to
  send. Approving is not publishing.

If all four hold, the pipeline is working. If the third or fourth does not, stop
and read [`trust-model.md`](trust-model.md) before wiring anything else.

## Then

| Next | Where |
|---|---|
| Run the other four demos, and the ten adversarial probes | [`demo-scenarios.md`](demo-scenarios.md) |
| Record what you actually observed | [`../VM_ACCEPTANCE.md`](../VM_ACCEPTANCE.md) |
| Unpause the scheduled tasks, once drafts look right | [`vm-deployment.md`](vm-deployment.md) |
| Add a calendar connector | [`../connectors/examples/calendar.md`](../connectors/examples/calendar.md) |
| Wire a community data layer | [`../reference/data-layer/`](../reference/data-layer/) |
| Understand what is guaranteed and what is not | [`trust-model.md`](trust-model.md) |

## What not to skip

Read the limits before relying on it. Approval gates, the Critic, verification,
budgets and injection defenses are instructions and skills: strong influence on
behavior, genuine defense in depth, **not** a sandbox and not access control. There
is no hard budget cap, because NanoClaw exposes no cost primitive to cap. A green
test suite is not a passing acceptance gate — they are different claims.
