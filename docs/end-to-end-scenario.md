# End-to-end scenario

One person, from never having heard of the community to a completed action —
showing how every layer connects. The persona and community here are invented;
substitute your own.

> Parts of this flow are **contract, not shipped code** — the onboarding surface
> and the data layer in particular. `architecture.md` marks which is which.

## Dana

29, relocating to a new city in about two months for work. Considering the north
side, looking for work in marketing, and wants to know people before arriving.

## 1. Discovery

Dana sees a link or QR from a campaign, an event, or a partner site. She lands on
a short page. She does not need to know what the platform is called, who runs it,
or how it is built.

> "Your community starts here." — *Get started, under a minute.*

How she arrived is recorded for attribution.

## 2. Onboarding, under a minute

Four screens (`onboarding.md`):

- **Identity** — Dana, English.
- **Interests** — work, community and people, events.
- **Context** — north side, `journey_stage: arriving`, expected in November.
- **Intent** — looking for *"marketing work and people around my age"*, can offer
  *"digital marketing, and I speak French"*. Consents to personalized
  recommendations and matching.

That creates `user_id`, profile, interests, needs, offers, location, stage,
consent and attribution. **Minimum viable context — not a complete profile.**

## 3. Handoff

> "You're ready. Continue with Zi."

A one-time token in the deep link ties her channel identity to the profile just
created. From Dana's side nothing restarted; it is one continuous flow.

## 4. First message, already in context

Not *"Hi, what's your name?"* but:

> "Hi Dana — I see you're heading to the north side and you're interested in
> marketing work, events and meeting people. Where would you like to start?"

`Find opportunities · Meet people · What's coming up · Ask me anything`

Dana: *"People, probably. I don't know anyone there."*

## 5. Just-in-time orchestration

Zi does not load the community knowledge base or the tool registry. It names the
intent — *community connection* — and pulls only what that needs: her profile,
the matching skill, the matching specialist if configured, the consent rules, and
the relevant community records.

The specialist receives `user_id` and `community_id`. Not the transcript.

## 6. Matching

It finds a relevant local group, a networking event next week, and two people
whose offers and needs complement Dana's. It checks `Consent` before surfacing
anything personal.

Zi replies with a few concrete options inside the conversation — not a results
page, not a filter panel.

Dana: *"Introduce me."*

## 7. Consent-based introduction

Zi does not hand over her details. It creates operational state:

```
connection_request → status: pending_consent
```

and asks the other person, through their own channel, on their own terms. Both
sides agree → the introduction happens. One declines → nothing personal is
revealed and Zi offers an alternative.

## 8. A second intent

Later: *"Can you also help me find marketing work?"*

No new flow, no re-asking what is known. Zi names the new intent, loads the
opportunity skill and the relevant records, and asks only the genuinely missing
question:

> "What kind of marketing — content, performance, product, or something else?"

The answer becomes a `Need`, under the normal memory rules.

## 9. What was learned, and what was not

- **User memory** — Dana prefers English; works in marketing.
- **Conversation memory** — what was just discussed.
- **Operational state** — an introduction awaiting the other person's consent.
- **Community knowledge** — the event, the group, the organizations.

Not every sentence became permanent memory. The profile improved through use
rather than through a longer form.

## Behind the scenes

```
QR → onboarding → profile + consent → identity linked
→ "help me meet people" → intent named
→ skill + specialist + tools + records selected for THIS task
→ specialist gets ids, fetches its own context
→ matching + consent policy
→ options in the conversation
→ "introduce me" → operational state → second consent
→ connection → records updated
→ next conversation starts richer
```

## What success means

Not a completed profile. **Time to first community value**: discovery →
onboarding → a relevant recommendation or a real action.

Worth measuring: start → onboarding completion; completion → activation; time to
first meaningful exchange; time to first relevant recommendation; share reaching
a first community action; engagement with introductions, events and
opportunities; return after first value.

## The principle it demonstrates

Dana never learns the architecture. She does not know which specialist ran, which
skill loaded, or where anything was stored.

> *I tell Zi what I need. Zi understands my context and helps me take the next
> useful step.*
