---
name: community-brain
description: Decide what community activity is worth remembering and record it with provenance. Use when reviewing community messages, when asked what the community knows about something, or when a recurring question suggests a gap in community knowledge.
---

# Community brain

Memory is curated, not accumulated. Most messages are not worth keeping.

## Signal filter

Classify each item:

```
noise · conversation · question · decision · event · resource
opportunity · community knowledge · action item · risk
```

`noise` and ordinary `conversation` are not stored. The rest are *candidates* — a
candidate is not a memory.

## Sensitivity check — before value

Never store, even when useful: personal data about an identifiable member without
consent · health, financial, legal, immigration or family circumstances · anything
from a private conversation · complaints or conflicts naming people · secrets or
credentials · anything the operator marked confidential.

If something is valuable but sensitive, store the *generalized* form. "Members often
ask how to get a permit" is community knowledge. "Ana is struggling with her permit"
is not, and never becomes an anonymized example without Ana's consent.

## Value test

Store only if: it will still be true and useful in a month · someone will plausibly
ask again · it is not already recorded · it is verified or clearly marked unverified.

## Record

```yaml
- id: ck-014
  type: faq                      # faq | rule | resource | decision | glossary | guide | event
  statement: "Tool library bookings open Monday for the following week."
  provenance: { source: organizers-group, date: 2026-08-14, verified_by: "Dana" }
  status: verified
  review_after: 2027-02-14
```

Provenance is mandatory. A memory without a traceable origin is a rumor.

## Prefer

Verified FAQs · recurring resources · community rules · confirmed events · public
decisions · approved guides · glossary terms · useful local knowledge.

## Maintain

Flag items past `review_after`. Surface contradictions rather than silently choosing
a winner — say both, say which is newer, ask. Retire what is superseded; keep the
record of the change.

## Boundaries

Community memory is readable in the community and operator contexts. It never
contains member private memory. Member memory never flows into it. Promotion of
community knowledge to public content requires verification and Level C approval.
