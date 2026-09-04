---
schedule: "0 9 * * 1"
---

Prepare this week's verification round.

Use the `trusted-source-verification` skill. Collect every event and resource
currently at `DISCOVERED`, `NEEDS_INFO` or `PENDING_VERIFICATION`. Group them by the
verifier responsible, and for each item state what you already have and exactly what
is missing.

If an item has been `PENDING_VERIFICATION` for more than one round, say so and note
how long.

If nothing needs verification, say exactly that in one line. Do not manufacture work
to fill the schedule.

Output the digest to the operator as a draft. Do not send it to verifiers yourself —
sending is Level C and needs an operator's approval. A scheduled run is not approval.
