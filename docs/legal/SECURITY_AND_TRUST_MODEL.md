# Security and trust model

> **Engineering template — not legal advice and not a compliance claim.**
> Drafted for an operator and their counsel to adapt. Installing Zi does not make
> any deployment compliant with any law. Review before production use.

Full engineering version: `../trust-model.md`. Summary for a legal or privacy review:

**Enforced by the NanoClaw runtime:** separation between the operator and member
contexts (separate agent groups, workspaces, memory, sessions) · credential secrecy
(injected at the network boundary, never present in the container) · tool
availability per group · scheduled tasks inert until a human enables them.

**Behavioral — instructions and skills, not access control:** approval gates · the
Critic · verification status · budget limits · prompt-injection defenses · consent
before data transfer.

Behavioral controls are defense in depth. They are not a sandbox and not a guarantee;
a novel prompt or a model failure can produce behavior the documents forbid. Assess
each connector on its worst case, not on the documented intent.

**Explicitly out of scope:** compromised host or container · malicious operator ·
malicious MCP server · platform account compromise · anything after content leaves
through a connector.

No certification, audit, or penetration test is claimed.
