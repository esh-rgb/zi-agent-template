# Data retention

> **Engineering template — not legal advice and not a compliance claim.**
> Drafted for an operator and their counsel to adapt. Installing Zi does not make
> any deployment compliant with any law. Review before production use.

Defaults in the `policy.retention` block of `config-example.md`. Operators set real
values for their jurisdiction.

| Class | Default | Rationale |
|---|---|---|
| Raw conversation | 30 days | Short by design; superseded by curated memory |
| Session working context | session only | Never promoted without a memory decision |
| Community knowledge | until superseded | Provenance retained through changes |
| Member memory | until the member deletes it | Theirs to end |
| Consent records | as required | Evidence a consent existed |
| Audit of sensitive actions | as required | Accountability for what left |
| Secrets | never stored | Not retention — they are never held |

## Requirements

Shortest useful period for raw conversational data. Curated memory over transcripts:
`community-brain` promotes deliberately rather than keeping everything. Every
retained item carries provenance and a review date where applicable. Deletion honors
the member's right regardless of the schedule. Retention is configurable, documented,
and communicated in the notice.

## Not covered

Retention by platforms (WhatsApp, calendar providers), by the operator's own systems,
or by anything downstream of a connector. Document those separately.
