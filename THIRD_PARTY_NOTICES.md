# Third-party notices

**This template contains no third-party code.**

Every component was written for this repository. Nothing was copied or adapted from
another codebase, so there is no third-party copyright to reproduce and no attribution
obligation to satisfy.

The machine-readable record is `third_party/manifest.yaml`. It is intentionally empty
of copied components.

## Interfaces this template targets

Named for accuracy. Targeting an interface is not copying an implementation, and
creates no license obligation here.

| Name | Relationship | License of the upstream project |
|---|---|---|
| NanoClaw | This template is stamped by NanoClaw. No NanoClaw code is included. | MIT — verified in the upstream `LICENSE` file |
| Agent Plugins 1.0.0 | `plugin.json` declares conformance to the published schema. The schema is referenced by URL, not vendored. | Specification, not code |

## Runtime dependencies

None. Scripts and tests use only the Node.js standard library (`node:fs`,
`node:path`, `node:url`, `node:test`, `node:assert`, `node:child_process`).
`package.json` declares no `dependencies` and no `devDependencies`, so nothing is
installed and nothing transitive enters the tree.

## If that ever changes

Any future third-party component must be recorded in `third_party/manifest.yaml`
with its license verified from the upstream `LICENSE` file — never inferred from a
README, a package description, a marketplace page, or a prior conversation — and must
not ship while `review_status` is `UNVERIFIED`.
