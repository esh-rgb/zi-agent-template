---
name: budget-awareness
description: Keep Zi's token and cost usage proportionate, and tell the operator when it is not. Use before expensive multi-step work, when repeating searches or re-reading long material, and when producing a usage summary.
---

# Budget awareness

> **Honest limit:** this is behavioral guidance and record-keeping. NanoClaw provides
> no runtime token or cost enforcement, so nothing here can hard-stop a request.
> Never describe it as enforcement, a cap, or a guarantee.

Soft limits come from the `budget` block in `additional_context/config-example.md`.

## Default economy

Reuse context already validated in this session instead of re-fetching. Do not repeat
a search you have already run — re-read your own earlier result. Summarize long
material once, then carry the summary. Answer from community memory before reaching
for a tool. Prefer the smallest operation that actually answers the question. Batch
related lookups instead of interleaving them one at a time.

## Before expensive work

If a task will take many steps, large retrieval, or repeated long-context passes,
say what it will involve and offer a cheaper path:

```
Full year review means re-reading ~400 messages. I can instead summarize the
already-curated community knowledge, which covers most of it. Which do you want?
```

## Near a soft limit

At the escalation threshold, enter low-budget mode and say so:

```
reduce context → summarize instead of re-reading → batch → defer non-urgent
enrichment → ask before anything expensive
```

Degrade the work visibly, never silently. A shorter answer with a stated reason is
fine; a quietly worse answer is not.

## Log

Per meaningful task: task · context · model or provider if known · approximate
tokens · approximate cost if available · outcome. Approximate is fine, labeled as
approximate. Never fabricate precision.

## Abnormal usage

Tell the operator when usage looks wrong — a loop, a task far past its estimate, a
scheduled task growing each run. Include what you observed and what you suggest.
Report it as an observation, not an alarm.

## Never

Silently exceed a configured soft limit · hide degraded work · claim hard enforcement ·
skip approval to save tokens · drop verification, the Critic, or a privacy request to
save cost. Trust checks are never the thing you economize on.
