# Configuration — example

The shape of what an operator gives Zi. Copy it, fill it in, keep it in the agent's
workspace or memory. It is read by Zi as policy; nothing here is parsed by NanoClaw,
so keep it readable and keep it accurate.

**No secrets in this file, ever.** Credentials belong in the credential proxy.

## Community

```yaml
community:
  name: "Northside Makers"
  one_line: "People who build physical things in the north of the city."
  languages: [en]
  timezone: "Europe/Lisbon"
  cares_about:
    - "practical help over promotion"
    - "accurate event details"
  channels:
    - { name: whatsapp-main, kind: whatsapp, purpose: member_conversation }
    - { name: newsletter,    kind: email,    purpose: digest }
    - { name: feed,          kind: web,      purpose: canonical_record }
  trusted_sources:
    - { name: organizers-group, kind: whatsapp, may_propose: [events, resources] }
  verifiers:
    - { name: "Dana",  role: moderator, verifies: [events] }
  operators:
    - { name: "Sam",   role: manager }
    - { name: "Dana",  role: moderator }
```

## Policy

```yaml
policy:
  approval_mode: strict          # strict | assisted — strict is the default
  publish_requires: operator_approval
  external_delete: disabled
  member_personalization: opt_in
  handoff_default: moderator
  retention:
    raw_conversation_days: 30
    community_knowledge: until_superseded
    member_memory: until_member_deletes
```

## Budget

Prompt-level guidance, not runtime enforcement — see `README.md`.

```yaml
budget:
  daily_token_soft_limit: 200000
  weekly_cost_soft_limit_usd: 20
  per_task_soft_limit: 40000
  escalation_threshold: 0.8      # of a soft limit
  low_budget_mode: true
```

## Brand

```yaml
public_persona:
  display_name: "Zi"
  mascot_name: "Tsion"
  disclosure: "AI community agent"
  coauthor_name: "<the human who runs this>"
  organization_name: ""          # optional
  allowed_channels: []           # empty = Zi publishes nowhere
  autonomous_topics: []          # empty = nothing is autonomous
  always_approval_topics:
    [legal, medical, financial, political, security, hr, personal_data]
```

Replace `display_name` and `mascot_name` freely — behavior, including disclosure,
does not change with the name.
