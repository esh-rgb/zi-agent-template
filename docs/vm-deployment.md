# Deploying to a NanoClaw VM

Exact steps. Nothing here has been run against a live install from the build
environment — `VM_ACCEPTANCE.md` records what was actually executed and observed.

This guide covers the general path, then a specific route for **WhatsApp on a
personal (shared) number**, which has constraints the other channels do not.

---

## 0. Safety audit — do this before anything else

Skip this only if your install has never had a channel wired.

A NanoClaw install that has been running for a while can carry wirings left by
old channel-registration cards at `engage_mode='pattern'` with pattern `.` —
respond to *everything*. On a personal-number WhatsApp install that shows up as
the agent replying to every message in your family and work groups.

With the host service running:

```bash
ncl wirings list --engage-mode pattern --engage-pattern "." --json
ncl messaging-groups list --channel-type whatsapp --is-group 1
```

Cross-reference. For every group wiring with pattern `.` that is not a chat you
deliberately want always-on, narrow or delete it **now**:

```bash
ncl wirings update <wiring-id> --engage-mode pattern --engage-pattern '\bZi\b'
# or
ncl wirings delete <wiring-id>
```

This step is the difference between Zi being a contained test agent and Zi
speaking in real community groups.

## 1. Which layout does your install need?

```bash
cd /path/to/nanoclaw
grep -rq "plugin.json" src/templates/ && echo CANONICAL || echo LEGACY
```

- `CANONICAL` — supports Agent Plugins. Use `ops/zi`.
- `LEGACY` — predates it. Use `build/legacy/zi`.

Installs from mid-2026 and earlier are `LEGACY`. That is expected and fully
supported; the legacy export exists for exactly this.

## 2. Get the template

```bash
git clone https://github.com/esh-rgb/zi-agent-template /tmp/zi
```

**Canonical:**

```bash
mkdir -p /path/to/nanoclaw/templates/ops
cp -r /tmp/zi/ops/zi /path/to/nanoclaw/templates/ops/zi
```

**Legacy** — point the template directory at the export rather than copying:

```bash
export NANOCLAW_TEMPLATES_DIR=/tmp/zi/build/legacy
```

`NANOCLAW_TEMPLATES_DIR` must be a local path. There is no remote fetch.

## 3. Install a channel

Zi needs one conversational channel. If you already have one wired and working,
skip to step 4.

### If your fork has no `channels` branch

NanoClaw ships no channel adapters in trunk — the `/add-<channel>` skills copy
them in from the `channels` branch. A fork created from `main` alone does not
have that branch, and the install fails at its first step. Check:

```bash
git ls-remote --heads origin | grep channels
```

No output means you need the branch. Fetch it from upstream without touching
`main` and without pushing anything:

```bash
git fetch https://github.com/nanocoai/nanoclaw channels:refs/remotes/origin/channels
```

That creates exactly the `origin/channels` ref the skills read.

### Then install

```bash
/add-telegram      # simplest: a bot token, two chats, no number risk
/add-whatsapp      # see the section below if using a personal number
/add-slack         # or discord, signal, matrix ...
```

## 4. Stamp both contexts

```bash
# canonical
ncl groups create --template ops/zi --name "Zi Operator"
ncl groups create --template ops/zi --name "Zi Member"

# legacy
ncl groups create --template zi --name "Zi Operator"
ncl groups create --template zi --name "Zi Member"
```

**Two groups is not optional.** NanoClaw's agent-group and session split is the
only runtime-enforced boundary in this design. One group serving both contexts
removes it.

Verify:

```bash
ncl groups list
ncl tasks list --group <operator-group-id> --status paused   # expect 4
```

## 5. Wire each group to its own chat

```bash
/manage-channels          # or: ncl wirings create ...
```

Operator group → the chat your operators use. Member group → where members reach
Zi. **Never wire both groups to the same messaging group.**

## 6. Tell each group which context it is

Message each agent once:

> You are the **operator** context for the community "<name>". Read
> `additional_context/operator.md`.

> You are the **member** context. Read `additional_context/member.md`.

## 7. Configure the community

Paste the filled-in blocks from `additional_context/config-example.md`, or just
describe the community and let Zi ask for what is missing. Zi has no community
until you give it one.

## 8. Optional tools

```bash
/add-gcal-tool      # calendar — enables a real calendar write in Demo B
```

Without it, Demo B still passes: Zi reports the connector is unavailable and
offers the event details to add manually. That is the designed fallback, not a
failure.

## 9. Enable tasks, one at a time

```bash
ncl tasks list --group <group-id> --status paused
ncl tasks resume <task-id>
```

Read each task's prompt first. All four produce drafts — confirm that yourself
rather than taking this document's word for it.

## 10. Verify

Run the scenarios in `demo-scenarios.md` and record results in
`VM_ACCEPTANCE.md`. Mark anything you did not run as `NOT TESTED`.

---

## WhatsApp on a personal (shared) number

Read this in full before running `/add-whatsapp`. The adapter behaves
**fundamentally differently** depending on whether the linked number is the
agent's own or your personal one, and the difference changes how you must set the
demo up.

### The risk

Linking your everyday number to an automation client can get that number
temporarily suspended or permanently banned by WhatsApp — losing the account,
chats and groups you rely on. A dedicated number (spare SIM, eSIM, old phone) or
Telegram avoids this entirely. If you proceed anyway, proceed knowingly.

### What actually works on a personal number

| | Works |
|---|---|
| Your self-chat ("Message yourself") | **Yes** — this is where the agent lives |
| A WhatsApp group you are in | **Yes** — engages on a name pattern, not @-mentions |
| Someone else DMing the agent | **No** — stranger DMs are ignored entirely: never read, never answered, never raised for approval |

The switch is `ASSISTANT_HAS_OWN_NUMBER` in `.env`. Absent or not `true` means
shared — the safe default. On shared: no mention signal is emitted, group wirings
fall back to a name pattern (`\b<AssistantName>\b`), auto-created chats default
to `unknown_sender_policy: 'strict'`, and outbound messages carry a name prefix.

### The two-context setup that works

```
Zi Operator  →  a NEW WhatsApp group you create for this (e.g. "Zi Ops Test")
Zi Member    →  your self-chat
```

Two distinct messaging groups, two agent groups, isolation intact. Do not use an
existing community group — create a fresh one.

### Steps

1. Complete the **step 0 safety audit** above. Non-negotiable on a personal number.
2. Fetch the `channels` branch if needed (step 3).
3. Run `/add-whatsapp`, answer `shared`, read the warning, acknowledge it.
4. Confirm `.env`:

```bash
grep -E '^(ASSISTANT_HAS_OWN_NUMBER|ASSISTANT_NAME)=' .env
# expect:
# ASSISTANT_HAS_OWN_NUMBER=false
# ASSISTANT_NAME=Zi
```

`ASSISTANT_NAME` is both the group engagement pattern and the outbound prefix, so
set it **before** wiring. Restart the service after changing `.env`.

5. Create the WhatsApp group, stamp both agent groups (step 4), wire them (step 5).
6. In the group, address Zi by name — `Zi, what needs verifying?` — or it will not
   engage. In your self-chat it responds to everything. Its replies are prefixed
   with its name.

### What you cannot demonstrate this way

A member reaching Zi from their own phone. On a personal number you play the
member in your self-chat. Record that as a known constraint in
`VM_ACCEPTANCE.md`, not as a pass.

---

## Troubleshooting

| Symptom | Cause |
|---|---|
| `Template missing required context/instructions.md` | Legacy install pointed at the canonical layout — use `build/legacy` |
| `Template folder not found` | Ref is relative to the templates dir; check `NANOCLAW_TEMPLATES_DIR` |
| `frontmatter accepts only schedule and script` | A task file was edited by hand |
| No tasks listed | Check `--status paused`; tasks never start active |
| `/add-<channel>` fails fetching the branch | Fork has no `channels` branch — see step 3 |
| Zi silent in a WhatsApp group | Shared number: address it by name; check `ASSISTANT_NAME` and restart |
| Zi answering in unrelated groups | A pattern `.` wiring survived — redo step 0 |
| Zi says it has no community | Expected before configuration — give it the config |

## Rollback

```bash
ncl groups delete --id <group-id>
```

Removes the group and its workspace. It does not undo anything already sent
through a connector — which is why sends require approval.

To unlink WhatsApp entirely, remove `store/auth/creds.json` and restart, then
remove the linked device from your phone.
