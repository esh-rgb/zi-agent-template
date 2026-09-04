# Implementation notes

Decisions worth their reasons, and the constraints that forced them.

## The template contract is smaller than it looks

NanoClaw's parser loads exactly four things: `context/`, `.mcp.json`, `skills/` and
`tasks/`. There is no config loader, no connector runtime, no test harness.

So `config/`, `connectors/` and `data/` as *loadable* directories do not exist. The
configuration examples live under `additional_context/` and are read by Zi as policy;
the connector contract and tests live in the repository, outside the template folder,
where they serve humans and CI rather than the runtime.

Discovered by reading `src/templates/parse.ts` in a NanoClaw checkout, not by
assuming.

## Only `.md` survives under `context/`

`readContextExtras` filters on `.endsWith('.md')`. A `config.yaml` placed under
`context/` is silently dropped — no error, no warning, and the agent never sees it.
That is why every configuration example is Markdown with fenced YAML, and why
`check-template.mjs` fails the build on any non-Markdown file in that directory.

## Nothing under `context/` is auto-injected

Extra files are copied into the workspace but never read unless `instructions.md`
points at them. An unreferenced file is invisible. CI asserts that every extra file
is referenced, so the template cannot ship dead weight that looks like coverage.

## Two layouts, one persona

Upstream moved to Agent Plugins 1.0.0 (`plugin.json` plus an `ai.nanoco.nanoclaw/`
extension directory). Installs predating that change key off `context/instructions.md`
at the template root and have no `plugin.json` handling at all — verified by grepping
a real checkout.

Rather than choose, `scripts/export-legacy.mjs` generates the legacy layout from the
canonical source by copying bytes. It never rewrites text, so the layouts cannot drift
in wording, and a test asserts the instructions are byte-identical. Editing `build/`
by hand fails that test.

## The Critic is not a skill

Skills load by description match. A Critic that only runs when it happens to trigger
is not a control. It lives in `instructions.md`, which is always in the prompt, with
the checklist in `approval-policy.md`.

The same logic explains what is missing: there is no specialist agent roster. A second
agent earns its existence with a distinct trust boundary, tool set or responsibility.
Named personas that merely divide the work add orchestration surface and a second
identity for the user to track, and add no boundary at all.

## Two groups, because that is the only real boundary

Everything in this template is text. Text influences a model; it does not constrain
it. The one hard boundary available is NanoClaw's own agent-group and session split —
separate workspaces, memory and wiring, enforced by the runtime.

Hence two stamped groups rather than one agent switching hats, and hence the
documentation says plainly that merging them removes the only guarantee there is.

## Budget is honest about what it is not

NanoClaw exposes no token or cost primitive. The `budget-awareness` skill opens by
saying so and forbids describing itself as enforcement. A test asserts that wording
stays. It would have been easy to ship a `budget:` block that looks like a cap; a
config key that looks enforcing and is not is worse than no key at all.

## The defense tests assert coverage, not behavior

`tests/defenses.test.mjs` checks that a named defense clause exists for each attack in
the brief. It cannot show the model resists the attack. The file says so in a comment,
the trust model says so, and the README says so, because a green suite is exactly the
kind of thing that gets quoted as if it meant more.

Live adversarial results belong in `VM_ACCEPTANCE.md`, per run.

## The example data is fictional on purpose

A community, its people, its referral entries. Inventing a plausible community was
more work than adapting a real one, and it is the only version that can be published.

## Verified against the real parser

The legacy export was parsed by NanoClaw's own `parseTemplate`, and all four task
schedules were validated through its own `prepareScheduledTask` — including the
frequency limit. That is stronger evidence than any local checker, and it is why the
Round 2 verification table can say `VERIFIED` rather than `assumed`.
