# Example connector — CRM

An operator-facing write. Level C, because it writes to a system other people read
and act on.

## Declaration

```yaml
name: crm
capabilities: [list_records, get_record, create_note, update_task]
read_scopes:  [crm.read]
write_scopes: [crm.notes, crm.tasks]
required_secrets: []          # OAuth or API key held by the credential proxy
approval_class: C
risk_class: hard_to_reverse   # an internal record is correctable, and someone acted on it meanwhile
rate_limits: "per provider"
health: healthy
```

Note what is absent from `capabilities`: no `delete_record`, no `merge_records`, no
`update_contact`. Least privilege, and rule 4 — the operator can disconnect this at
any time and Zi keeps working, tracking follow-ups in the community data layer
instead.

## Install

Any CRM MCP server, with proxy-managed credentials. This template declares none.
Without it the `crm` specialist records tasks in the data layer and reminds a human
— degraded, not broken.

## The consent question this raises

A CRM is an operator-facing system, and a member's context is member data. Writing
"Rae is looking for housing" into a CRM is a data transfer, not a note. It needs a
`Consent` record covering that purpose and that recipient — `member.md`: member data
does not flow back into the operator context by default, and
`reference/data-layer/consent.mjs` is the gate.

An operator asking for it is not the member consenting to it.

## Rules specific to writing here

- **Attribute the human, not Zi.** A note records which operator asked for it.
- **Never close someone's task for them.** Zi records state and reminds; a human
  decides something is done.
- **Fail closed and loudly.** A partially applied update is a wrong record that
  looks right. On timeout or unknown state, say the write did not happen and check.
