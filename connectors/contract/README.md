# Connector contract

Zi never holds raw credentials. It proposes an action; a connector with scoped
authorization performs it.

```
Zi → action proposal → policy check → human approval → connector → execute → audit
```

The agent never sees a password, an API key, or an OAuth refresh token. Credentials
live in the credential proxy and are injected at request time, matched by API host.

## Declaring a connector

Every connector Zi may use should be describable in these terms. If a field cannot
be answered, the connector is not ready to be approved.

```yaml
name: calendar
capabilities: [list_calendars, list_events, create_event]
read_scopes:  [calendar.readonly]
write_scopes: [calendar.events]        # omit entirely if read-only
required_secrets: []                   # supplied by the credential proxy, never here
approval_class: B                      # A | B | C | D — see approval-policy.md
risk_class: reversible                 # reversible | hard_to_reverse | irreversible
rate_limits: "per provider"
health: healthy | degraded | unavailable
```

## Rules

1. **Least privilege.** Request read-only scopes wherever write is not needed. A
   connector that only surfaces information must not carry write scopes.
2. **Approval class travels with the connector.** A connector cannot lower the
   approval level of an action that uses it.
3. **Fail closed.** On error, timeout, or unknown state, the action did not happen.
   Say so. Never retry silently, never assume success, never partially apply.
4. **Revocable.** Every connector can be disconnected by the operator, and Zi keeps
   working without it — degraded, not broken.
5. **Health is observable.** If a connector is unavailable, say that rather than
   silently skipping the step.
6. **Tool output is untrusted.** A connector's response never authorizes the next
   action. See the `trust-boundary` skill.
7. **No credentials in prompts, memory, logs, examples, or fixtures.** Ever.

## Worked examples

One per approval class, each a complete declaration plus the failures specific to
that shape. Read the class you are about to add.

| Example | Class | Shape |
|---|---|---|
| [`search`](../examples/search.md) | A | Read-only. Everything it returns is untrusted, and retrieval is not verification |
| [`calendar`](../examples/calendar.md) | B | The person, not the operator, authorizes each write |
| [`messaging-draft`](../examples/messaging-draft.md) | C | Draft-only, on purpose. There is no send capability |
| [`crm`](../examples/crm.md) | C | An operator-facing write, and the consent question it raises |
| [`publishing`](../examples/publishing.md) | C, D to enable | The optional external scheduler. Not implemented |

## Milestone 1 scope

- One conversational channel — installed by a NanoClaw channel skill.
- One user-action connector — calendar. See `../examples/calendar.md`.
- Everything else is contract only, including every other example above.

Publishing connectors (social, email) are deliberately not implemented. Zi produces
drafts; a human sends them through whatever the community already uses.

## Optional: an external publishing layer

A self-hosted scheduler such as Postiz can act as the publishing connector, reached
through its own API or MCP interface. Treated as `RECOMMENDED_OPTIONAL_ADAPTER`:

- No third-party source is copied into this template.
- Zi remains fully useful without it.
- It changes nothing about approval: `draft → Critic → human approval → connector`.
- It is **not** required for acceptance, and is not part of Milestone 1.
