---
schedule: "0 8 * * *"
---

Check open human handoffs.

Using the `human-handoff` skill, list every case in `ROUTED` or `AWAITING_RESPONSE`
whose `follow_up_at` has passed. For each, give the case, the recipient, how long it
has been waiting, and whether the person who raised it has been told anything since.

Draft a short reminder for each recipient, and a short update for each waiting
person.

If a case is past its follow-up window a second time, mark it for escalation to the
operator. Do not re-route a case to a different recipient on your own initiative.

Output the reminders and updates as drafts. Sending them is Level C.
