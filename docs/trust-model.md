# Trust model

What this template actually guarantees, and what it does not. Read it before
relying on Zi for anything consequential.

## Guaranteed by the runtime, not by us

- **Context isolation.** Two agent groups have separate workspaces, memory and
  sessions. A member group cannot read the operator group's files. This is NanoClaw,
  and it holds regardless of what the model decides. **One deliberate exception:**
  a community data layer, once wired, is shared by design — see below.
- **Credential secrecy.** The agent never receives raw credentials. The credential
  proxy injects them at the outbound HTTPS boundary, matched by API host. A prompt
  that extracts "the API key" gets nothing, because there is nothing in the container
  to extract.
- **Tool availability.** An agent can only call MCP servers configured for its group.
- **Paused tasks.** Stamping never starts background work; every task requires a
  human to resume it.
- **Schedule sanity.** Ungated recurring tasks are capped at four fires per 24 hours.

## Behavioral — instructions and skills, not enforcement

Approval gates · the Critic and its `BLOCK` · verification status · budget limits ·
injection defenses · memory boundaries within a context · consent before data
transfer.

These shape behavior strongly and they are defense in depth. They are **not** a
sandbox, **not** access control, and **not** a guarantee. A sufficiently novel
prompt, an unusual tool result, or a model failure can produce behavior these
documents forbid.

**Consequences, stated plainly:**

- Do not connect a connector whose worst-case misuse you could not tolerate.
- Do not grant write scopes you do not need.
- Do not put the operator and member contexts in one agent group. It is the only hard
  boundary in the design, and merging them removes it.
- Do not treat "the template says approval is required" as proof approval happened.
  Check the audit trail.
- Do not rely on budget guidance as a spending cap. NanoClaw provides no token or
  cost enforcement, so nothing here can hard-stop a request.

## The data layer is a deliberate hole in the isolation

Zi is specified as an orchestration layer over a shared community data layer.
Shared is the point: a specialist fetches a record rather than being handed a
transcript. But it means the strongest guarantee in this design — that two agent
groups cannot see each other's data — stops being absolute the moment such a
store is wired.

Stated precisely:

- **Filesystem, memory and session isolation still hold.** NanoClaw enforces them
  and the data layer does not change that.
- **Records in the shared store are reachable from any context configured to read
  it.** That is a configuration decision the operator makes, not something the
  template can enforce.
- **Consent and purpose limitation move to the record level.** With a shared
  store, "this context cannot see it" is no longer the protection. The protection
  is that personal fields require a `Consent` record for that specific purpose
  before they cross to a person, an organization or a channel. That is a
  behavioral control, not a runtime one.
- **Therefore: scope what each context may read.** Give the member context read
  access to community records, not to other members' personal records. Do not
  wire one all-powerful connection and rely on instructions to hold the line.

If you wire a data layer and grant every context full access to it, you have
chosen a system with one trust boundary, not two. That can be a legitimate
choice. It should be a knowing one.

## Threats this addresses

Direct and indirect prompt injection · prompt and secret extraction · cross-context
exfiltration · tool-output injection · privilege escalation by claim · approval
bypass · recipient substitution · hallucinated verification · encoded instructions ·
unverified content reaching publication · personal data leaving without consent.

Coverage is asserted by `tests/defenses.test.mjs` — which checks that a defense
clause **exists** for each. Whether the model then behaves correctly is a live test,
recorded per-run in `VM_ACCEPTANCE.md`. A passing test suite is not evidence of
correct behavior under attack.

## Threats this does not address

A compromised host or container · a malicious operator · a malicious MCP server ·
model failure independent of any attack · platform-side account compromise · anything
after content leaves through a connector.

## Credentials

Never in this repository, in a prompt, in memory, in logs, in examples, or in test
fixtures. `mcp.json` is empty; channels and tools are installed by NanoClaw skills
that handle their own authentication. A repository-wide secret scan runs in CI.

## Reporting

See `SECURITY.md`.
