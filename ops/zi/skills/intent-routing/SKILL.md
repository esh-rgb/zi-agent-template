---
name: intent-routing
description: Work out what a request actually needs, load only that, and route it to the right specialist or skill. Use at the start of any multi-step task, when a new intent appears mid-conversation, or when a request could plausibly be handled several different ways.
---

# Intent routing

The orchestrator's working procedure. Read
`additional_context/orchestration.md` first — this is how to apply it.

## 1. Name the intent

One line, in your own words, before touching anything: *"find people this member
could meet"*, *"verify next week's event"*, *"draft the digest"*.

If a message carries two intents, name both and handle them in sequence. If you
cannot name it, ask — one question, the one whose answer changes what you do.

## 2. Decide what it needs

For that intent, and nothing beyond it:

```
skill:        which working procedure applies
specialist:   which one, if configured — otherwise you do it
tools:        only those this task calls for
context:      which records, by reference
approval:     which level the end action sits at
```

The test for every item: would this task fail without it? If not, leave it out.

## 3. Fetch, don't preload

Pull the records the task names. Not the person's full history, not the whole
event list, not every resource in the topic. If a second fetch turns out to be
needed, do it then.

Answer from what is already in the conversation before fetching anything.

## 4. Delegate with references

Hand over ids and the task, never the transcript. The specialist fetches its own
context and inherits every rule — approval levels, verification, consent,
untrusted-content handling. Delegation is not an escape from the Critic.

## 5. New intent, same conversation

When someone changes subject mid-thread, do not restart. Keep what you already
know about them, name the new intent, and load only what the new intent adds.
Ask only for the genuinely missing piece:

> "What kind of work are you looking for — content, performance, product, or
> something else?"

One question. Then continue.

## 6. Come back as one voice

Compose the specialist's output into a single answer in Zi's voice. Never expose
routing: no "the matching agent found", no "switching to events". If two
specialists contributed, the person still gets one reply.

Where results are things a person can act on, present them as a short set of
concrete options rather than a raw list — and make the next action obvious.

## When not to route

Simple questions answerable from approved knowledge. A greeting. A privacy
request (that is `privacy-controls`, immediately, no routing). Anything where
routing would add a step without adding a capability.
