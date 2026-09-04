# Deploying to a NanoClaw VM

Exact steps. Nothing here has been run against a live VM from the build environment —
`VM_ACCEPTANCE.md` records what was actually executed and observed.

## 1. Which layout does your install need?

```bash
cd /path/to/nanoclaw
grep -rq "plugin.json" src/templates/ && echo CANONICAL || echo LEGACY
```

- `CANONICAL` — your install supports Agent Plugins. Use `community/zi`.
- `LEGACY` — your install predates it. Use `build/legacy/zi`.

## 2. Copy the template in

**Canonical:**

```bash
git clone https://github.com/esh-rgb/zi-agent-template /tmp/zi
mkdir -p /path/to/nanoclaw/templates/community
cp -r /tmp/zi/community/zi /path/to/nanoclaw/templates/community/zi
```

**Legacy** — point the template directory at the export instead of copying:

```bash
git clone https://github.com/esh-rgb/zi-agent-template /tmp/zi
export NANOCLAW_TEMPLATES_DIR=/tmp/zi/build/legacy
```

`NANOCLAW_TEMPLATES_DIR` must be a local path. There is no remote fetch.

## 3. Stamp both contexts

```bash
# canonical
ncl groups create --template community/zi --name "Zi Operator"
ncl groups create --template community/zi --name "Zi Member"

# legacy
ncl groups create --template zi --name "Zi Operator"
ncl groups create --template zi --name "Zi Member"
```

Two groups is not optional. It is the only hard isolation boundary in the design.

Verify:

```bash
ncl groups list
ncl tasks list --group <operator-group-id> --status paused   # expect 4
```

## 4. Wire channels

```bash
/manage-channels          # or: ncl wirings create ...
```

Operator group → the channel your operators use. Member group → where members reach
Zi. Never wire both groups to the same messaging group.

## 5. Tell each group which context it is

Message each agent once:

> You are the **operator** context for the community "<name>". Read
> `additional_context/operator.md`.

> You are the **member** context. Read `additional_context/member.md`.

## 6. Configure the community

Paste the filled-in blocks from `additional_context/config-example.md`, or just
describe the community and let Zi ask for what is missing.

## 7. Optional tools

```bash
/add-gcal-tool      # calendar — enables the calendar-action flow
/add-whatsapp       # or /add-telegram, /add-slack ...
```

Zi works with one channel and nothing else. Every tool is optional.

## 8. Enable tasks — deliberately, one at a time

```bash
ncl tasks list --group <group-id> --status paused
ncl tasks resume <task-id>
```

Read each task's prompt first. All four produce drafts, but you should confirm that
for yourself rather than take this document's word for it.

## 9. Verify

Run the five scenarios in `demo-scenarios.md` and record the results in
`VM_ACCEPTANCE.md`. Mark anything you did not run as `NOT TESTED`.

## Troubleshooting

| Symptom | Cause |
|---|---|
| `Template missing required context/instructions.md` | Legacy install pointed at the canonical layout — use `build/legacy` |
| `Template folder not found` | Ref is relative to the templates dir; check `NANOCLAW_TEMPLATES_DIR` |
| `frontmatter accepts only schedule and script` | A task file was edited by hand |
| No tasks listed | Check `--status paused`; tasks never start active |
| Zi says it has no community | Expected before configuration — give it the config |

## Rollback

```bash
ncl groups delete --id <group-id>
```

Removes the group and its workspace. It does not undo anything already sent through a
connector — which is why sends require approval.
