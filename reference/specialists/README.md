# Specialist definitions

**Optional. Unsupported. Not part of the template.**

`orchestration.md` fixes the closed list of nine specialists Zi may route to and
says delegation never widens permission. What it does not say is what each one
*is* — so an operator configuring one had a name and nothing else. These nine
files are that missing half.

One file per specialist, same five headings each time:

| Heading | What it settles |
|---|---|
| **Job** | The bounded responsibility. If a task is not in one of these, it is a skill |
| **Receives** | The references it gets. Never a transcript — specialists share state, not conversations |
| **Tools** | Narrowed to the task. A long tool list is a correctness problem, not just a cost one |
| **Approval** | The levels it inherits **unchanged**. A specialist can never lower one |
| **Refuses** | The specific failures this one is prone to, named so they can be checked |

Plus **Deploy as**: whether it earns a separate NanoClaw agent group or stays a
skill Zi runs itself. `docs/specialists.md` is the guide for that decision; the
short version is that only `publishing` and, at volume, `events` have an argument
beyond tidiness.

## The list is closed

`community` · `events` · `content` · `partner` · `matching` · `publishing` ·
`moderation` · `crm` · `analytics`

Do not add a tenth because a task has a different name. `orchestration.md` says
prefer a skill, and `implementation-notes.md` records why: a named persona that
merely divides the work adds orchestration surface and a second identity for the
user to track, and adds no boundary at all. A test asserts this directory matches
the list exactly — in both directions.

## Nothing here is a second identity

The person talks to Zi and gets an outcome. Zi never says "switching you to the
Events agent". These files describe how work is divided behind one identity, not a
cast.
