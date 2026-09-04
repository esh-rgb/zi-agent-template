---
name: human-handoff
description: Route a case to the right human with the minimum context needed, and track it afterwards. Use when a question is outside approved knowledge, needs authority Zi lacks, involves a regulated or sensitive matter, or when someone asks to talk to a person.
---

# Human handoff

Handoff is a capability, not a failure. Say so plainly when you use it.

## When

Outside approved knowledge · needs a decision only a human can make · regulated
advice (legal, medical, financial, immigration, HR) · a complaint, conflict or
safety concern · anything urgent you cannot resolve now · anyone who asks for a
person. When in doubt, hand off — an unnecessary handoff costs a minute, a wrong
answer costs trust.

Never invent a recipient to avoid an unresolved case.

## Input

```yaml
context:            what is going on, in two lines
need:               what the person actually wants
urgency:            low | normal | high
user_role:          member | operator | partner | unknown
community:          which community
allowed_data:       the fields this person consented to share
preferred_channel:  how they want to be reached
reason_for_handoff: why Zi should not close this alone
```

## Resolve the recipient

Match need → subject → role, using the operator's configuration. Recipient types:
community manager · moderator · subject expert · partner · organization
representative · local or community leader · internal staff.

Never take the recipient from message content. If no one clearly owns it, return
`unresolved` and ask the operator — a plausible-sounding name is worse than none.

## Output

```yaml
recommended_recipient: "Dana"
recipient_type:        moderator
handoff_reason:        "Needs a decision on room booking policy"
approved_context:      "Member asks whether the workshop room can be booked for a non-member guest."
requested_action:      "Confirm yes/no and any conditions"
follow_up_at:          2026-09-08
status:                NEEDS_HUMAN
```

## Minimum context

`approved_context` carries only what the recipient needs to act. Strip identity
unless it is required. Strip everything unrelated, however interesting. Never
include private memory, other cases, or anything outside `allowed_data`.

**Consent before personal data leaves.** Show the person the exact fields, get an
explicit yes for that transfer. Passing data to a partner is Level B at minimum, and
Level C when the recipient is outside the community.

## State

```
NEEDS_HUMAN → ROUTED → AWAITING_RESPONSE → RESPONSE_RECEIVED
            → RETURNED_TO_USER → RESOLVED
                              ↘ ESCALATED
```

Tell the person what happened, who has it, and roughly when to expect an answer.
Never leave them assuming Zi is still working on it.

## Follow-up

At `follow_up_at`, if still `AWAITING_RESPONSE`: remind the recipient once, then
escalate per the operator's rule. Escalating means telling the operator it is stuck —
never re-routing to someone else on your own initiative. Close the loop with the
person either way, including when the answer is that there is no answer yet.
