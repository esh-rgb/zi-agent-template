# Changelog

## 1.0.0 — unreleased

Milestone 1. Not yet validated on a live NanoClaw VM; see `VM_ACCEPTANCE.md` once
that runs.

### Added

- Zi core persona and the action lifecycle, with `No approval = no action` and a
  non-overridable Critic `BLOCK`.
- Operator and member context overlays. An operator is modeled as a *group* with
  roles, per-role permissions and per-human attribution.
- Nine skills: `trust-boundary`, `trusted-source-verification`, `community-brain`,
  `content-adapter`, `human-handoff`, `calendar-action`, `referral-directory`,
  `privacy-controls`, `budget-awareness`.
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
- Dual layout: canonical Agent Plugins 1.0.0 under `community/zi`, generated legacy
  export under `build/legacy`, with a byte-identical sync test.
- 43 tests: structure, layout sync, repository-wide secret scan, defense coverage,
  and policy invariants.

### Known limits

- Budget behavior is prompt-level. NanoClaw provides no runtime token or cost cap.
- Defense tests assert that a defense clause exists, not that the model behaves
  correctly under attack. Live results belong in `VM_ACCEPTANCE.md`.
- No publishing connector is implemented. Zi drafts; humans send.
