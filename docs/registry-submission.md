# Registry submission

Preparation for publishing Zi to `nanocoai/nanoclaw-templates`. **Nothing here has
been submitted**, and nothing should be until the gate below passes.

## The gate comes first

`VM_ACCEPTANCE.md` says it plainly, and this page does not get to soften it:

> Competition packaging does not begin until the VM rows are filled in and the
> critical ones pass. Do not mark a row from expectation — only from something
> observed.

Twenty live rows and ten adversarial probes are `NOT TESTED` today. A green local
suite is not a substitute: `npm test` asserts that a policy clause exists, never
that the model obeys it. Submitting a template whose behavioral controls have never
been observed under attack would be exactly the overclaiming `CONTRIBUTING.md`
rule 7 forbids.

So: run the VM acceptance, fill in what you actually saw, then come back here.

## Category: `ops`

Verified directly against the registry: its precedented categories are single
business-function words — `sales`, `support`, `engineering`, `marketing`, `ops`,
`finance`. **`community` is not among them**, which is why the earlier
`templates/community/zi` path was a placeholder rather than a decision.

`ops` fits without inventing a category. The template's center of gravity —
verification, approval levels, handoff, scheduled routines, the Critic — is
operational governance, not content production. A community is who it serves, not
what it does.

This is a judgment, not a confirmation. The registry's own contribution guidance
says to ask first when a category's fit is uncertain, so **open the issue below
before any submission PR.**

### Pre-submission issue, ready to paste

> **Title:** Category guidance for a community-operations agent template
>
> Hello — I'm preparing to submit a general-purpose community agent template and
> would like to check the category before opening a PR, per the contribution
> guidance.
>
> The template is an operations agent for running a community: trusted-source
> intake, event verification with a human-only `VERIFIED` transition, channel-aware
> drafting, approval levels on every external action, human handoff, and scheduled
> routines that produce drafts rather than publishing.
>
> I read the precedented categories as single business-function words (`sales`,
> `support`, `engineering`, `marketing`, `ops`, `finance`). `community` is not among
> them, and I would rather not invent a category. My reading is that `ops` fits:
> the center of gravity is operational governance rather than content production,
> and "community" describes who it serves rather than what it does.
>
> Is `templates/ops/zi` the right home, or would you prefer something else?
> Happy to follow whatever you suggest.

## What a submission PR would carry

Only the template. The repository around it — tests, scripts, reference
implementations, legal templates, acceptance record — stays here.

```
templates/ops/zi/
├── plugin.json
├── mcp.json                          # {"mcpServers":{}} — declares no credentials
├── README.md
├── skills/                           # 11 skills
│   └── <name>/SKILL.md
└── ai.nanoco.nanoclaw/
    ├── context/
    │   ├── instructions.md
    │   └── additional_context/       # 12 files, each referenced from instructions.md
    └── tasks/                        # 4 tasks, created paused
```

That is `ops/zi/` copied verbatim. Do not hand-assemble it, and do not submit
`build/legacy/` — the legacy export exists for installs predating Agent Plugins and
is generated, not authored.

## Pre-flight checklist

Every line observed, not assumed.

- [ ] `VM_ACCEPTANCE.md` live rows filled in; the critical ones pass
- [ ] Adversarial probes recorded individually, with the prompt used and the
      response observed
- [ ] Category confirmed by the registry in the issue above
- [ ] `npm run check` passes
- [ ] `npm run build` leaves `build/` unchanged
- [ ] `npm test` passes
- [ ] `npm run validate:reference` passes
- [ ] No secrets, and no organizational identifiers — both are CI-enforced, and
      both are worth a human read of the diff anyway
- [ ] `mcp.json` is still `{"mcpServers":{}}`
- [ ] Every claim in `ops/zi/README.md` is one the acceptance record supports
- [ ] `LICENSE`, `LICENSE_AUDIT.md` and `THIRD_PARTY_NOTICES.md` still accurate:
      no third-party code, zero components in the manifest
- [ ] `CHANGELOG.md` moved from `unreleased` to a dated release

## What the listing must not claim

The template's honest limits are the reason to trust the rest of it. Carry them
into the listing rather than leaving them for someone to discover:

- Isolation comes from NanoClaw's agent groups. Everything else — approval gates,
  the Critic, verification, budgets, injection defenses — is instructions and
  skills. Real defense in depth, not a sandbox and not access control.
- No hard budget enforcement, because NanoClaw exposes no cost primitive to cap.
- No compliance claim. `docs/legal/` holds engineering templates needing legal
  review.
- No credentials: the template declares no MCP servers and needs no keys.
- The reference implementations under `reference/` are not part of the template and
  are not submitted with it.
