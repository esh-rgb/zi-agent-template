# Example connector — publishing

The optional external scheduler the contract mentions as a
`RECOMMENDED_OPTIONAL_ADAPTER`. **Not implemented in Milestone 1**, and not
required for acceptance. This is the declaration an operator would have to satisfy
before one could be approved.

## Declaration

```yaml
name: publishing
capabilities: [list_targets, schedule_post, get_post_status]
read_scopes:  [publish.read]
write_scopes: [publish.schedule]
required_secrets: []          # every channel token stays in the credential proxy
approval_class: C             # D to enable the connector at all
risk_class: irreversible      # published is published; a correction is a new post
rate_limits: "per target"
health: healthy
```

Two approval classes, on purpose. Enabling a publishing connector is Level D — it
is a new class of external reach, and `approval-policy.md` puts "enabling a
high-privilege connector" and "enabling a new class of autonomous publishing" there.
Each individual post is then Level C.

No `delete_post` capability. External deletion is in the template's "never" list,
and a connector that can unpublish is a connector that can be talked into
unpublishing.

## What it does not change

```
draft → Critic → human approval → connector → execute → audit
```

A scheduler moves *when* something goes out. It does not move who approved it. An
approved post scheduled for Thursday is one approved action with a delay, not a
standing permission for Thursdays.

A self-hosted scheduler is the honest option here: no third-party source is copied
into this template, and Zi remains fully useful without any of it.

## Before approving one

1. Which targets does the token reach? A token that reaches more than the approved
   target is over-scoped, whatever the connector is named.
2. What happens on a partial failure — two channels of three? Fail closed and
   report per target; never "published" as one word.
3. Who can revoke it, and how fast?
4. Does the audit record survive the connector being disconnected? If the only
   record of what went out lives in the vendor, there is no record.
