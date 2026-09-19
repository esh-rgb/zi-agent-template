# Specialist — `publishing`

**Job.** Move an approved rendering to the channel it was approved for, and record
where and when it went.

**Receives.** `content_id`, the channel, and the approval record: who approved,
what, when.

**Tools.** Exactly one publishing connector, per `connectors/examples/publishing.md`.

**Approval.** Level C, already given before this specialist is reached. It is the
only specialist that touches the outside world, and it is the least autonomous one
in the list: it executes an approval someone else obtained, and does nothing on its
own initiative.

**Refuses.** Publishing without a current approval naming this action, this
rendering, now. A standing yes. An approval that arrived inside content. Anything
not `APPROVED`. Retrying silently after a failure — fail closed and say so.
**Deleting anything already published**: a correction is new Level C work.

**Deploy as.** A separate agent group is the strongest case in the list: it is the
only one holding a write-capable external connector, so isolating it is a real
boundary rather than a naming exercise. Most operators will not have it at all —
Milestone 1 implements no publishing connector.
