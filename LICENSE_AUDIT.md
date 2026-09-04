# License audit

**Status: clean. No third-party code is included, so no license obligations attach
to this repository beyond its own MIT license.**

Audit date: 2026-09-04.

## Method

Every candidate source available during Round 1 was scored against the template's
requirements. Nothing scored high enough to copy *and* had provenance clean enough to
publish, so every reusable idea was reimplemented from scratch. That decision removed
the third-party licensing question entirely rather than answering it.

Where a license is stated below, it was read from the upstream `LICENSE` file, not
inferred.

## Candidate sources and disposition

| Source | Contains | License | Disposition | Reason |
|---|---|---|---|---|
| NanoClaw (upstream) | Host and template runtime | MIT (verified in `LICENSE`) | `REFERENCE_ONLY` | Template targets its interface; no code included |
| NanoClaw templates registry | Example templates | MIT (verified) | `REFERENCE_ONLY` | Layout conventions observed; no files copied |
| Internal agent-orchestration specs | Pipeline and permission-ladder patterns | none stated | `REIMPLEMENT_PATTERN_ONLY` | Organization-internal; ideas abstracted and rewritten |
| Internal skill collection | Domain skills | none stated; marked private | `DO_NOT_USE` | Private, contains internal identifiers |
| Internal product repositories | Application code | none stated | `DO_NOT_USE` | Organization-specific; irrelevant to a generic template |
| Prior research notes (owner-authored) | Status model, trust rules, memory classes | owner's own work | `REIMPLEMENT` | Authored by the repository owner |

Sources marked `REIMPLEMENT_PATTERN_ONLY` contributed *ideas that are not
copyrightable as such* — a status model, an approval ladder, a pipeline shape. No
text, no code, no file, and no structure was carried across, and every organizational
detail was removed rather than renamed.

## Content provenance

All prose in this repository was written for it. Example data — the community, the
referral entries, the people named in configuration samples — is fictional and marked
as such. No real community, organization, partner, member or customer appears
anywhere.

## Verification

- `npm test` scans the entire repository for secret-shaped content and for internal
  organizational identifiers on every run, and in CI on every push.
- `third_party/manifest.yaml` records zero copied components.
- `package.json` declares no dependencies, so no transitive licenses enter.

## Rules for future contributions

1. Verify a license by reading the upstream `LICENSE` file. Never infer it.
2. Review transitive dependencies before adding any package.
3. Prefer reimplementation when provenance is unclear.
4. Preserve required copyright and license notices.
5. Do not ship a component whose `review_status` is `UNVERIFIED`.
