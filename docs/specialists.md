# Specialists — when one earns its own runtime

`orchestration.md` fixes the closed list of nine specialists and says what routing
to one must never do. This page answers the deployment question it deliberately
leaves open: **is this specialist a separate NanoClaw agent group, or a skill Zi
runs itself?**

The definitions are in [`reference/specialists/`](../reference/specialists/) — one
file each, with the job, the references it receives, its tools, the approval levels
it inherits unchanged, and what it refuses.

## The default is a skill

`implementation-notes.md` records the reasoning, and it has not changed:

> A second agent earns its existence with a distinct trust boundary, tool set or
> responsibility. Named personas that merely divide the work add orchestration
> surface and a second identity for the user to track, and add no boundary at all.

Zi routing to a skill is one process, one memory, one audit trail. Zi routing to a
second agent group is two of each, plus a handoff between them where context can be
dropped, duplicated or leaked. That cost is worth paying for a boundary. It is not
worth paying for tidiness.

## The test

A specialist earns a separate agent group when at least one is true:

1. **It holds a tool the rest of Zi should not hold.** A write-capable external
   connector is the clear case. Isolating it means a prompt that reaches Zi's
   member context cannot reach the thing that publishes.
2. **It ingests a steady stream of untrusted content.** A high-volume intake of
   forwarded messages and fetched pages is an attack surface with a shape of its
   own, and it is worth having that shape sit somewhere other than where members
   talk.
3. **It answers to different people.** If a different set of humans approves its
   actions and reads its output, the split already exists organizationally.

Convenience, tidiness, "it feels like its own thing", and wanting a name in the
architecture diagram are not on the list.

## Applied to the nine

| Specialist | Deploy as | Why |
|---|---|---|
| `publishing` | **Separate group**, where it exists at all | The only one holding a write-capable external connector. Test 1. Most operators will not have it: Milestone 1 implements no publishing connector |
| `events` | **Separate group at volume**, otherwise a skill | The one steady inbound stream of untrusted content. Test 2, and only once the volume is real |
| `crm`, `partner` | Skill, unless the external connector exists | With a real CRM connector attached, test 1 applies to that connector and nothing else |
| `community`, `content`, `matching`, `moderation`, `analytics` | **Skill** | No distinct tool, no distinct approver, no distinct intake. Splitting them buys a name |

## What a split does not buy

**Not permission.** A specialist inherits the same approval levels, the same
verification rules, the same consent requirements and the same untrusted-content
handling. A task passed to a specialist is not a task that escaped the Critic, and
a specialist cannot approve its own action because it is a different agent.

**Not isolation from the member.** The person still talks to Zi. There is one
identity in front of them, and Zi never says "switching you to the Events agent".

**Not shared state.** This is the cost, and it is the one people discover late.
NanoClaw isolates agent groups by design and provides no shared store between them.
Two specialists in two groups share **nothing** unless a data layer sits under both
— and that data layer is then the one deliberate crossing of the isolation
boundary, which `docs/trust-model.md` says must be scoped per community and per
context, or two trust boundaries collapse into one wearing two names.

So splitting a specialist out has a real price: everything it needs to remember now
has to live somewhere both sides can read. Pay it for a boundary. Not for a name.

## Stamping one

Same as stamping Zi itself — a specialist group is an agent group like any other:

```bash
ncl groups create --template ops/zi --name "Zi Publishing"
```

Then narrow it: give that group only the connector its definition names, wire it to
the operators who approve its actions, and tell it which specialist it is in its
standing configuration, exactly as `instructions.md` requires Zi to know whether it
is the operator or the member context. A group that does not know which one it is
must ask before doing anything that depends on it.
