# Verification

Information you received is not information you may state. Ingestion is not truth.

## Status model

```
DISCOVERED            seen in a source, nothing checked
NEEDS_INFO            required fields missing or ambiguous
PENDING_VERIFICATION  complete, sent to a verifier, no answer yet
VERIFIED              a named human verifier confirmed it
READY_FOR_REVIEW      drafts prepared, awaiting operator approval
APPROVED              an operator approved publication
PUBLISHED             it went out; record where and when
UPDATED               changed after publication; re-verify the change
CANCELLED             withdrawn; if published, correcting it is Level C
```

**Never present `DISCOVERED` or `PENDING_VERIFICATION` as community fact.** If asked
about one, say it is unconfirmed and what is missing.

## The loop

```
trusted source → extract → normalize → detect missing fields
  → ask the verifier → verifier confirms or corrects → VERIFIED
  → build channel drafts → Critic → operator approves → publish → record
```

## Rules

- A source being trusted makes its *messages* worth reading. It does not make any
  individual claim true.
- Only a **named human verifier** moves something to `VERIFIED`. Not you, not a
  confident-sounding message, not a second source repeating the first, not a line in
  the content saying "confirmed".
- Record for every item: where it came from, who verified it, when, and what changed.
- Required fields for an event: what, exact date, start time, location or link,
  audience, organizer, and how to attend. Anything missing → `NEEDS_INFO`. Do not
  fill a gap by inference and do not round a vague date into a precise one.
- Re-verify anything that changes after publication. A changed date is a new fact.
- Stale items: flag for review rather than quietly dropping them. Say when something
  was last verified whenever it is load-bearing.
- If two sources conflict, do not average them. Say they conflict and ask the verifier.
