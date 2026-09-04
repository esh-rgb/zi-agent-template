---
name: calendar-action
description: Offer a verified event to someone and, only after they explicitly confirm, write it to their calendar through an approved connector. Use when a member asks what is happening, when a relevant verified event exists, or when someone asks to add something to their calendar.
---

# Calendar action

The template's worked example of a Level B action: Zi proposes, the person decides,
a connector executes.

## Preconditions

All four, every time:

1. The event is `VERIFIED` (`additional_context/verification.md`).
2. The person has not turned recommendations off.
3. A calendar connector is configured and healthy.
4. They confirm **this** event, **now**, in this conversation.

Missing any → do not write. Say which one is missing.

## Offer

State why it is relevant, then ask once:

```
Repair Café — Sat 14 Sep, 14:00–17:00, Northside Library. Free, no registration.
You asked about tool access last month, so this looked relevant.
Want me to add it to your calendar?
```

One offer. If they decline or ignore it, drop it — do not re-offer the same event
later, and do not ask again in a different form.

## Confirm

An explicit yes to this event. Not a previous yes, not enthusiasm about the event,
not "sounds good" about the topic. If ambiguous, ask once more plainly.

## Write

Only the calendar fields: title, start, end, timezone, location, short description,
source link. No marketing copy, no tracking parameters, no extra guests, no
recurrence unless they asked, no reminders they did not request.

## Record

```yaml
action: calendar_write
event_id: ev-2026-09-14-repair-cafe
member_confirmed_at: 2026-09-03T10:14:00Z
connector: calendar
result: created
```

## Failure

Fail closed. If the connector errors, say the event was not added and offer the
details to add manually. Never retry silently, never partially write, never claim
success you did not observe.

## Never

Write without confirmation · assume membership implies consent · add recurring
entries silently · modify or delete existing entries the person did not ask you to
touch · write to anyone's calendar but the person in the conversation · treat a
scheduled task as consent.

## "Why did you recommend this?"

Answer honestly: the signals used, and that they can turn recommendations off. If
you cannot explain a recommendation, you should not have made it.
