# Changelog

## 1.0.0 — unreleased

Milestone 1. Not yet validated on a live NanoClaw VM; see `VM_ACCEPTANCE.md` once
that runs.

### Added — completing the template

- **Reference implementations for the contracts that had none**, in a new
  top-level `reference/` directory. Deliberately **outside** `ops/zi`: the
  template stays instructions, skills, MCP declarations and tasks, with no
  runtime code and no dependencies. Each is optional, unsupported, wired by the
  operator or not at all, and on no acceptance row.
  - `reference/data-layer/` — a JSON Schema per entity in `data-layer.md`, a
    file-backed store implementing fetch-by-reference, consent-gated disclosure,
    provenance stamping and an append-only audit log, and an MCP server over it.
    The server needs no credentials, exposes no externally-visible write, and
    refuses to assign `VERIFIED`, `APPROVED` or `PUBLISHED` — those stay reachable
    only by a named human. Plus a fictional seed community and a ~150-line
    standard-library schema validator, because a dependency was not worth it.
  - `reference/onboarding/` — the four screens from `onboarding.md` as one
    self-contained page that makes no network request and stores nothing, and the
    linking-token rules as code: short-lived, single-use, hashed at rest,
    constant-time compared, redacted out of logs, and never accepted from message
    content.
  - `reference/specialists/` — a definition for each of the nine specialists in
    `orchestration.md`'s closed list: job, references received, tools, the
    approval levels it inherits unchanged, and what it refuses. A test asserts the
    directory matches the closed list in both directions.
- `docs/specialists.md` — when a specialist earns a separate NanoClaw agent group
  and when it stays a skill. Only `publishing`, and `events` at volume, have an
  argument beyond tidiness, and the cost of splitting one out is that agent groups
  share no state.
- `docs/quickstart.md` — the fifteen-minute path from clone to a passing Demo A.
- `docs/registry-submission.md` — the `ops` category rationale, a ready-to-paste
  pre-submission issue for `nanocoai/nanoclaw-templates`, the exact layout a
  submission PR would carry, and a pre-flight checklist whose first line is that
  the `VM_ACCEPTANCE.md` gate comes first. Nothing has been submitted.
- Four more worked connector examples — `search` (A), `messaging-draft` (C,
  draft-only by design), `crm` (C) and `publishing` (C, D to enable) — so the
  contract has one per approval class rather than one in total.
- `tests/reference.test.mjs` and `tests/docs.test.mjs`. The second derives every
  documented count from the filesystem: the README's test count had drifted to 43
  when the suite defined 56, and this changelog said nine skills when there were
  eleven. That class of drift now fails CI.
- Repository scaffolding: pull request and issue templates carrying
  `CONTRIBUTING.md`'s non-negotiable rules as a checklist, a code of conduct, an
  `.editorconfig`, and a `validate:reference` CI step.

### Changed — completing the template

- `docs/architecture.md` now has **three** states rather than two. Contracts with
  a worked reference move to *Referenced*; shared state across specialists, tool
  discovery as a runtime mechanism, and cross-channel identity stay *Open* with
  nothing behind them.
- `data-layer.md` and `onboarding.md` point at their references while keeping
  their "contract, not implementation" status intact — which stays true, because
  the references are not part of the template.
- `VM_ACCEPTANCE.md` marks the parser-evidence row **stale**: it was observed
  against a template of 125-line instructions, 9 context extras and 9 skills, and
  the template is now 142 / 12 / 11. No parser run has covered the current shape,
  so the row says `RE-RUN REQUIRED` rather than quietly carrying new numbers as if
  they had been observed. No live row was marked from expectation.

### Changed

- **Zi is now specified as an orchestration layer**, not a single agent that does
  everything itself: intent resolution, just-in-time context, delegation to a
  closed list of specialists, tool discovery per task, and a community data layer
  as the source of truth. This reverses the earlier "no specialists" decision —
  the reasoning behind that decision is why the specialist list is closed and
  short, but the product target changed, so routing is now part of the design.
  Added `orchestration.md`, `data-layer.md`, `onboarding.md`, the
  `intent-routing` and `onboarding-continuity` skills, and
  `docs/end-to-end-scenario.md`.
- `docs/architecture.md` now separates **locked** (shipped and verified) from
  **open** (contract defined, implementation not shipped), because a template
  ships no database and no web app and the difference should not be blurred.
- `docs/trust-model.md` states that a shared community data layer is a deliberate
  crossing of the context isolation boundary, and what an operator must scope to
  keep two trust boundaries rather than one.
- Zi's acknowledgment reaction is 🌶️ where a channel supports reactions —
  classified Level A, and explicitly never readable as approval or sign-off.
- Registry category moved from the placeholder `community` to `ops`
  (`templates/community/zi` → `templates/ops/zi`). Verified directly against
  `nanocoai/nanoclaw-templates`: its precedented categories are single
  business-function words (`sales`, `support`, `engineering`, `marketing`, `ops`,
  `finance`) and `community` is not among them. `ops` fits without inventing a
  category, since the template's center of gravity — verification, approval
  levels, handoff, scheduled tasks, the Critic — is operational governance, not
  content production. Confirming `ops` is accepted stays a Phase 2 step: an
  issue on the registry before any submission PR, per its own contribution
  guidance to ask first when a category's fit is uncertain.

### Added

- Zi core persona and the action lifecycle, with `No approval = no action` and a
  non-overridable Critic `BLOCK`.
- Operator and member context overlays. An operator is modeled as a *group* with
  roles, per-role permissions and per-human attribution.
- Eleven skills: `intent-routing`, `trust-boundary`,
  `trusted-source-verification`, `community-brain`, `content-adapter`,
  `human-handoff`, `calendar-action`, `referral-directory`, `privacy-controls`,
  `onboarding-continuity`, `budget-awareness`.
- Four scheduled tasks, created paused, each producing a draft and never publishing.
- Untrusted-content contract: twelve rules, an enumerated source list, and a named
  response for each of thirteen attacks.
- Event/resource status model with human-only transition to `VERIFIED`.
- Channel policy layer: one factual core, per-channel rendering.
- Referral directory as a bounded curated list, with recommendation, introduction and
  data transfer as three separate consents.
- Privacy controls: access, correction, export, deletion, stop personalization.
- Connector contract plus one worked example (calendar, Level B).
- Eleven legal engineering templates, each labeled non-certifying.
- Dual layout: canonical Agent Plugins 1.0.0 under `ops/zi`, generated legacy
  export under `build/legacy`, with a byte-identical sync test.
- 89 tests: structure, layout sync, repository-wide secret scan, defense coverage,
  policy invariants, the reference implementations, and documentation consistency.

### Known limits

- Budget behavior is prompt-level. NanoClaw provides no runtime token or cost cap.
- Defense tests assert that a defense clause exists, not that the model behaves
  correctly under attack. Live results belong in `VM_ACCEPTANCE.md`.
- No publishing connector is implemented. Zi drafts; humans send.
