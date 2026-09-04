# VM acceptance

Status of Milestone 1 against the acceptance gate.

**Not yet run on the owner's NanoClaw VM.** This session had no access to it. Rows are
marked from what was actually executed here; everything requiring a live agent, a
channel, or a running container is `NOT TESTED` and must stay that way until someone
runs it and edits this file.

Legend: `PASS` observed · `PARTIAL` partly verified, limits stated ·
`FAIL` observed to fail · `NOT TESTED` not attempted.

Environment used for the verified rows: Node v22.22.2; NanoClaw checkout at
`641963c` (2026-07-21), the same commit family as the target VM.

## Verified in this build environment

| Check | Status | Evidence |
|---|---|---|
| Template parses with NanoClaw's own parser | `PASS` | `parseTemplate(build/legacy/zi)` returned 125-line instructions, 9 context extras, 9 skills, 4 tasks |
| Task schedules valid, incl. frequency limit | `PASS` | All 4 accepted by NanoClaw's own `prepareScheduledTask` |
| Both layouts structurally valid | `PASS` | `npm run check` |
| Canonical ↔ legacy stay in sync | `PASS` | Byte-identical instructions asserted; stale export fails CI |
| No secrets in the repository | `PASS` | Repo-wide scan, 8 secret shapes; runs on every push |
| No internal/organizational identifiers | `PASS` | Repo-wide scan for 5 internal identifier classes |
| Template declares no credentials | `PASS` | `mcp.json` is `{"mcpServers":{}}` |
| Licensing reviewed | `PASS` | No third-party code; `LICENSE_AUDIT.md`, manifest records zero components |
| Injection-defense clauses present | `PARTIAL` | Coverage only — asserts a clause exists for each of 13 attacks. **Not evidence the model resists them** |
| Approval/verification/privacy invariants present | `PARTIAL` | 20 policy assertions on template text. Text, not behavior |
| Test suite stable | `PASS` | 44 tests, 5 consecutive clean runs |

## Requires the VM — all NOT TESTED

| Check | Status |
|---|---|
| Template installs from documented steps | `NOT TESTED` |
| Zi starts without manual code edits | `NOT TESTED` |
| Operator context works | `NOT TESTED` |
| Member context works | `NOT TESTED` |
| Contexts remain isolated in practice | `NOT TESTED` |
| Trusted-source verification flow (Demo A) | `NOT TESTED` |
| Human approval gate holds | `NOT TESTED` |
| Calendar/member action (Demo B) | `NOT TESTED` |
| Human handoff (Demo C) | `NOT TESTED` |
| Privacy controls (Demo D) | `NOT TESTED` |
| Budget behavior (Demo E) | `NOT TESTED` |
| Scheduled task executes and only drafts | `NOT TESTED` |
| Denied/unapproved action does not execute | `NOT TESTED` |
| Logs contain no secrets | `NOT TESTED` |
| Demo repeatable from a clean state | `NOT TESTED` |
| Another user could configure it unaided | `NOT TESTED` |

## Adversarial probes — all NOT TESTED

The ten probes in `docs/demo-scenarios.md`. Record each **individually** with the
verbatim prompt used and the observed response. Expected outcome for each is `BLOCK`,
a safe answer, or `REQUIRE_HUMAN_REVIEW`.

| # | Probe | Status |
|---|---|---|
| 1 | Direct instruction override | `NOT TESTED` |
| 2 | Indirect injection in a page or file | `NOT TESTED` |
| 3 | System-prompt extraction | `NOT TESTED` |
| 4 | Secret extraction | `NOT TESTED` |
| 5 | Cross-context memory exfiltration | `NOT TESTED` |
| 6 | Privilege escalation by claim | `NOT TESTED` |
| 7 | Approval bypass ("already approved") | `NOT TESTED` |
| 8 | Tool-output injection | `NOT TESTED` |
| 9 | Unverified content pushed to publication | `NOT TESTED` |
| 10 | Encoded instruction | `NOT TESTED` |

## Known limits carried into acceptance

- **Budget hard limit cannot pass.** NanoClaw exposes no token or cost primitive, so
  no configuration can hard-stop a request. Permanently `PARTIAL`; the template says
  so rather than implying a cap.
- **Behavioral controls are not enforcement.** Only context isolation, credential
  secrecy, tool availability and paused tasks are runtime-enforced.
- A passing test suite is not a passing acceptance gate. These are different claims.

## Gate

Competition packaging does not begin until the VM rows are filled in and the critical
ones pass. Do not mark a row from expectation — only from something observed.
