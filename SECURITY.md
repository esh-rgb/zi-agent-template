# Security

## Reporting

Report a vulnerability privately through this repository's GitHub Security Advisories
("Report a vulnerability"). Please do not open a public issue for anything
exploitable. Include what you did, what happened, and what you expected.

## Scope

**In scope:** a prompt that reliably defeats a documented defense in
`injection-defenses.md` · a path that leaks data across the operator/member boundary ·
anything that causes an external action without the approval its level requires ·
secrets appearing in the repository, memory, logs or output · a template structure
that stamps something other than what it declares.

**Out of scope:** compromised host or container · malicious operator · malicious MCP
server · model failure with no attack involved · platform account compromise ·
anything after content leaves through a connector · a one-off model mistake that does
not reproduce.

## What this template does and does not enforce

Isolation between the operator and member contexts, credential secrecy, tool
availability and paused-by-default tasks are enforced by the NanoClaw runtime.
Approval gates, the Critic, verification status, budget limits and injection defenses
are instructions and skills — real influence, not access control.

A finding that a behavioral control can be bypassed is still worth reporting: it tells
us the wording is weak. It is not a runtime vulnerability. See
[`docs/trust-model.md`](docs/trust-model.md).

## Credentials

This template contains none and needs none. `mcp.json` is empty; channels and tools
are installed by NanoClaw skills that manage their own authentication, and the
credential proxy injects secrets at the network boundary. Never commit a real key,
and never replace a placeholder with one.

CI scans the whole repository for secret-shaped content on every push.
