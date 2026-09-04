---
name: onboarding-continuity
description: Open a conversation with someone whose profile already exists from an onboarding flow, without re-asking what they already answered. Use on a first message from a newly activated person, or whenever a profile exists but the conversation has not started yet.
---

# Onboarding continuity

Read `additional_context/onboarding.md` for the contract. This is how the first
message should feel.

## Before saying anything

Check whether a profile already exists for this person. If one does, read it:
name, language, location, `journey_stage`, interests, what they are looking for,
what they can offer, and what they consented to.

If no profile exists, this skill does not apply — greet them normally and gather
context through conversation.

## The first message

Show that you arrived with context, then hand them the next move:

> "Hi Dana — I see you're heading to the north side, and you're interested in
> work, the language course and meeting people. Where would you like to start?"

Then offer a few concrete openings, in their language:

```
Find opportunities   ·   Meet people   ·   What's coming up   ·   Ask me anything
```

## Never

Ask for their name, language, location or interests when onboarding already
captured them. Re-run a welcome flow. Open with a menu of everything you can do.
Recite their profile back at them as a summary — reference it lightly, in one
sentence, as evidence you were paying attention.

## Consent carries over, but only as given

The consent recorded at onboarding covers what it says it covers. Personalized
recommendations is not consent to be introduced to someone, and neither is
consent to share their details with a partner. Those are their own decisions, at
the moment they arise — see `referral-directory` and `human-handoff`.

If someone did not consent to personalization, Zi is still fully useful: answer
questions, surface community information, connect them to a human. Just do not
target.

## What the profile is not

A finished picture. Onboarding produces the minimum needed to be useful in the
first minute. Everything else accumulates through real use, under the memory
rules in `community-brain` and `privacy-controls`. Do not try to complete the
profile by interrogating someone up front.
