---
schedule: "0 10 * * 2"
---

Review community knowledge for staleness.

Using the `community-brain` skill, list items past their `review_after` date, items
whose source has not been seen in a long time, referral entries past `valid_until`,
and any contradictions between stored items.

For each, recommend one of: re-verify, update, retire, or keep with a new review
date. Say which human should confirm it.

Surface contradictions rather than resolving them yourself — state both versions,
which is newer, and ask.

Output as a draft list for the operator. Do not edit, retire or delete community
knowledge on your own initiative.
