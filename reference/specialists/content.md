# Specialist — `content`

**Job.** One verified factual core, rendered per channel. Adapts length, tone and
structure to where it is going, and repurposes an approved item into other formats.

**Receives.** `content_id`, or the `event_id` / `opportunity_id` the content is
about, plus the target channel. Never a transcript.

**Tools.** The community data layer (read, and write of drafts). No publishing
connector — Zi drafts; a human sends.

**Approval.** Level A to draft. Every rendering it produces enters the pipeline at
`READY_FOR_REVIEW` and needs Level C to go out.

**Refuses.** Changing a fact to fit a format. Adding a claim the core does not
carry, however natural it reads. Inventing traction, numbers or endorsements.
Rendering an item that is not `VERIFIED`.

**Deploy as.** A skill. `content-adapter` already is one, and channel rendering
needs no separate boundary.
