# Community data layer

**Structured community data is the source of truth.** Not the transcript, not
what someone said once, not Zi's recollection. When Zi or a specialist needs a
fact about a person, an event or an organization, it fetches the record.

> **Status: contract, not implementation.** A NanoClaw template ships
> instructions, skills and tasks — it ships no database. The schema below is what
> Zi expects; an operator supplies the store behind it (an MCP server, an API, or
> at small scale a maintained file). Until one is wired, Zi works from
> conversation and its own memory, and should say so rather than implying it has
> a directory it does not have.

## Entities

| Entity | Holds | Key fields |
|---|---|---|
| `Person` | An individual in the community | `user_id`, display name, languages, location, `journey_stage`, interests, consent |
| `Organization` | A partner, employer, service or institution | `organization_id`, name, type, topics, verification status |
| `Community` | A community or sub-community | `community_id`, name, topics, languages, location |
| `Event` | Something happening at a time and place | `event_id`, plus the required fields in `verification.md` |
| `Opportunity` | Something a person could take up — a role, a program, a place | `opportunity_id`, topic, audience, source, validity |
| `Need` | Something a person is looking for | `need_id`, `user_id`, topic, urgency, status |
| `Offer` | Something a person can give | `offer_id`, `user_id`, topic, availability |
| `Content` | A draft, a post, a guide | `content_id`, status per `verification.md`, channel renderings |
| `Conversation` | A thread, for reference only | `conversation_id`, channel, participants |
| `Location` | A place, at the granularity the community uses | `location_id`, name, region |
| `Relationship` | A connection between two entities | type, both ids, how it was established |
| `Permission` / `Consent` | What a person allowed, for what purpose | `user_id`, scope, purpose, granted at, withdrawn at |
| `Task` | Open operational work | `task_id`, owner, status, follow-up date |

`journey_stage` is deliberately generic: a relocation community, an alumni
network and a cohort program each define their own stages. Configure them; do not
assume them.

## Rules

**Consent is an entity, not an assumption.** Before any personal field crosses to
another person, an organization or a channel, check for a `Consent` record
covering *that* purpose. No record, no transfer — ask the person instead. A
membership is not a consent. An old consent for one purpose is not consent for a
new one.

**Fetch by reference.** A specialist receives ids and fetches what it needs. It
does not receive a bundle of everything known about a person on the chance it
proves useful.

**Records carry provenance.** Where a fact came from, who verified it, when. A
record with no traceable origin is a rumor with a schema.

**Minimum viable context.** Onboarding creates enough to start, never a complete
profile. The rest accumulates through use — see `onboarding.md`.

**The store is shared; the conversation is not.** Two agent groups reading the
same data layer is deliberate. It is also the one place where the isolation
between contexts is intentionally crossed, which is why consent and purpose
limitation are enforced at the record level rather than assumed from the
boundary. `docs/trust-model.md` states this plainly.
