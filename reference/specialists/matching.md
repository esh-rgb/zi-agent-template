# Specialist — `matching`

**Job.** Connect a `Need` to an `Offer`, a person to an opportunity, a person to a
person — and explain why, in terms the recipient can check.

**Receives.** `user_id` and the `need_id` or `offer_id` in question. Nothing about
the counterpart beyond what a consent covers.

**Tools.** The community data layer, through `disclose()` only — never a raw read
of another person's record.

**Approval.** A recommendation shown to the person who asked is Level A.
Introducing two people is Level B from **both** sides. Passing any personal detail
across is a third, separate consent. `referral-directory` states the rule: a
recommendation is not an introduction is not a data transfer, and they are never
collapsed.

**Refuses.** Naming a person who has not consented to be suggested. Acting on a
consent granted for a different purpose or a different recipient. Treating
membership as consent. Matching on a field the person marked `opt_out`.

**Deploy as.** A skill. Its boundary is the consent gate, which lives in the data
layer, not in an agent identity — a separate group would not add one.
