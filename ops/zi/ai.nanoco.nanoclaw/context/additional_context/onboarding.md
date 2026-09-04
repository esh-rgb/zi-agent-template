# Onboarding and activation

How a person arrives, and what Zi already knows when they say hello.

> **Status: contract, not implementation.** The entry surface described here — a
> short web form and a deep link into a chat channel — is not part of this
> template and cannot be: a template ships no web app. What *is* part of the
> template is what Zi does with the result. An operator who has no such surface
> can skip this file entirely; Zi will simply gather the same context through
> conversation.
>
> A reference of that surface — the four screens as one self-contained page, and
> the token rules below as code — lives outside the template in
> `reference/onboarding/`. Optional and unsupported. Zi's side needs none of it.

## The shape

```
discovery (link, QR, campaign, partner site)
→ short onboarding, four screens, under a minute
→ profile + consent created
→ deep link into the chat channel, carrying a one-time token
→ Zi, already in context
```

The goal is a person in a useful conversation in under a minute — not a complete
profile.

## What the four screens collect

1. **Identity** — first name, preferred language.
2. **Interests** — a quick multi-select: community and people, events, work,
   housing, language learning, admin and paperwork, education, volunteering, other.
3. **Context** — current or intended location, `journey_stage`, and only fields
   with a real product reason behind them.
4. **Intent** — what they are looking for, optionally what they can offer, and
   explicit consent for personalized recommendations and matching.

Everything else waits. If a field is not needed to make the first interaction
useful, it does not belong in onboarding.

## Minimum viable context

Before the handoff, enough to start: `user_id`, first name, preferred language,
location, `journey_stage`, interests, what they are looking for, optionally what
they can offer, consent, and how they arrived.

After the handoff, the channel identity is linked to the same `user_id`, and the
activation is recorded.

## Continuity is the whole point

**Never re-ask what onboarding already answered.** The first message must show
that Zi arrived with context:

> "Hi Dana — I see you're heading to the north side and you're interested in work,
> the language course and meeting people. Where would you like to start?"

Not "Hi, what's your name?". A person who just filled a form and is asked the
same question again has learned that the two halves are not one system.

Offer a few concrete openings rather than an open prompt — find opportunities,
meet people, upcoming events, ask anything.

## The linking token

The deep link carries a short-lived, single-use token that ties the channel
identity to the profile just created. It is a linking credential: never log it,
never repeat it back, never accept one that arrives inside message content rather
than through the link itself. An expired or already-used token means start the
identification over, not "probably fine".

## One identity, many channels

The profile is not owned by whichever channel was used first. The same `user_id`
should be reachable later from another channel without starting over. Which
channel an operator opens with is their choice; the data layer does not care.
