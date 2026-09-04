# Connector permissions

> **Engineering template — not legal advice and not a compliance claim.**
> Drafted for an operator and their counsel to adapt. Installing Zi does not make
> any deployment compliant with any law. Review before production use.

Every connector is a third party that may receive data. Document each before
enabling it.

```yaml
- connector: calendar
  provider: "<name>"
  purpose: "add events a member explicitly asked for"
  data_sent: [event title, time, location, description]
  personal_data: "the member's own calendar identity"
  scopes: [calendar.events]
  approval_class: B
  retention_at_provider: "per provider policy — link it"
  revocation: "operator disconnects; Zi degrades to manual details"
```

## Requirements

Least privilege — read-only unless write is needed. Purpose limitation — a connector
enabled for one purpose is not reused for another without review. Consent before
personal data leaves (`referral-directory`, `human-handoff`). Every connector
revocable, with Zi still working after revocation. Credentials only via the
credential proxy — never in the template, container, prompt, memory or logs. Failure
is closed: an error means the action did not happen.

## Operator checklist

Named provider and purpose · exact data sent · lawful basis if personal data is
involved · provider's own retention and sub-processors · listed in the privacy
notice · revocation tested.
