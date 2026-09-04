# Repository inventory

Round 1 survey of the sources available when this template was designed. Recorded so
the provenance of every decision is auditable, and so nobody re-derives it later.

Repository names are given by role rather than by internal name where the name itself
is organization-specific — this is a public repository, and the inventory should not
leak what the template deliberately excludes.

| Source | Purpose | License | State | Relevant assets | Internal/secret risk | Fit | Recommendation |
|---|---|---|---|---|---|---:|---|
| **This repository** | The Zi template | MIT | greenfield | — | none | — | `TARGET` |
| NanoClaw (upstream) | Host runtime and template parser | MIT (verified) | active | Template contract, skill format, scheduling | none | — | `REFERENCE_ONLY` |
| NanoClaw templates registry | Published example templates | MIT (verified) | active | Layout and category conventions | none | — | `REFERENCE_ONLY` |
| Internal agent-orchestration specs | Architecture for an organizational agent | none stated | active | Action pipeline; permission ladder | **high** — decision log, tracker IDs, named units | 92 / 90 | `REIMPLEMENT_PATTERN_ONLY` |
| Owner's prior research notes | Analysis of earlier agent experiments | owner-authored | complete | Status model; "draft, review, human sends"; memory classes; canary leakage test | medium — names real people and conversations | 95 / 88 / 84 | `REIMPLEMENT` |
| Internal skill collection | Domain skills for internal work | none stated; **marked private** | active | SKILL.md structure only | **high** — work email, internal process docs | <40 | `DO_NOT_USE` |
| Internal agent/orchestrator system | Personal assistant agent roster | none stated | active | 9 named specialist agents | medium-high — personal identity, work email | 41 | `REIMPLEMENT_PATTERN_ONLY` (rejected: multi-agent theater) |
| Internal operations dashboard | Community and partner pipeline UI | none stated | active | Partner pipeline shape | medium — internal even with synthetic fixtures | <40 | `REFERENCE_ONLY` |
| Internal product handoff doc | A development plan | none stated | 2 files | — | **high** — labeled proprietary | <40 | `DO_NOT_USE` |
| Various internal web apps | Events, journey, route-finder UIs | none stated | active | — | medium — one commits a live project URL and anon JWT | <40 | `REFERENCE_ONLY` |
| Unrelated desktop app | Screen recorder | MIT | active | — | none | <40 | `REFERENCE_ONLY` |

## Scoring

Weighted: generic community usefulness 25 · plug-and-play value 20 · direct M1 value
20 · privacy and security compatibility 15 · implementation simplicity 10 · license
clarity 10. Threshold 80. Everything below 80 was rejected and not carried forward,
including components that were historically important.

## What was actually taken

Four patterns cleared the threshold and were **reimplemented from scratch**, with all
organizational detail removed rather than renamed:

1. The action pipeline — `Observe → Draft → Critic → Approval → Connector → Audit`.
2. The permission ladder, remapped onto approval levels A–D.
3. The event status model, `DISCOVERED` through `CANCELLED`.
4. "Draft. Review. Human sends. No external delete."

Plus two design constraints carried from the owner's research: memory classes must be
separate boundaries rather than one store with metadata, and a cross-context canary
test is required — both learned from an observed context-leak in an earlier system.

## What was deliberately rejected

The multi-agent specialist roster (adds orchestration surface, adds no trust
boundary) · every organizational brand, workflow and integration · the dashboard ·
domain-specific skills · anything naming a real person, partner, customer or
internal system.

## Result

No file was copied from any source. See `LICENSE_AUDIT.md`.
