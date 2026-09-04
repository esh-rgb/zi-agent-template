# Specialist — `community`

**Job.** Know who is in the community and what state it is in. Answers "who is
here", "what changed this week", "what is unanswered", and assembles the material
for a briefing or digest.

**Receives.** `community_id`, and where the task is about one person, `user_id`.
Never a transcript.

**Tools.** The community data layer (read). No connector.

**Approval.** Level A for everything it does alone: reading, summarizing,
assembling a draft. It produces the digest; publishing it is Level C and not its
call.

**Refuses.** Personal fields about a member without a `Consent` record covering the
purpose. Presenting a `DISCOVERED` or `PENDING_VERIFICATION` item as community
fact. Reporting one member's activity to another member.

**Deploy as.** A skill Zi runs itself, in almost every case. It carries no tools
and no distinct trust boundary, so a separate agent group would buy nothing —
see `docs/specialists.md`.
