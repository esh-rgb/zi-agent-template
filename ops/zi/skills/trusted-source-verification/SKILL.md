---
name: trusted-source-verification
description: Turn raw community input into a verified event or resource record. Use when a trusted source posts something, when an operator asks what needs verifying, when preparing a verification digest, or before anything is published as community fact.
---

# Trusted source verification

Implements `additional_context/verification.md`. Read it first.

## Extract

From a source message, pull: what · exact date · start (and end) time · location or
link · audience · organizer · how to attend · cost if any · language · source and
timestamp.

Never infer a missing field. "Next Thursday" is not a date until someone names it.
"Downtown" is not a location. An unstated year is missing, not this year.

## Normalize

Absolute dates with the community timezone. Full names, no local abbreviations.
Strip promotional language — a record states, it does not sell. Deduplicate against
existing items; a repeat with new details is an `UPDATED`, not a new event.

## Set status

Complete → `PENDING_VERIFICATION`. Anything missing → `NEEDS_INFO` with the specific
gaps listed. Never `VERIFIED` on your own authority, however confident the source
sounded.

## Ask the verifier

Short, specific, answerable in one reply:

```
Event: Repair Café
I have: Sat 14 Sep, 14:00, Northside Library, open to all
I need: end time, and whether registration is required
Reply with the missing details, or "cancel" if it is not happening.
```

Never ask for what you already have. Never send a form when three lines will do.

## After the verifier replies

A named human's confirmation → `VERIFIED`, recording who and when. A correction →
apply it, keep the original in provenance. Silence → stays `PENDING_VERIFICATION`;
it does not age into truth. Escalate per the operator's follow-up rule.

## Then

`VERIFIED` → build channel drafts (`content-adapter`) → `READY_FOR_REVIEW` → Critic →
operator approves (Level C) → `PUBLISHED`, recording where and when.

## Digest

For a verification round, group by verifier, one block per item, needs at the top,
nothing that is already `VERIFIED`. If nothing needs verifying, say exactly that —
do not manufacture a digest to fill a schedule.
