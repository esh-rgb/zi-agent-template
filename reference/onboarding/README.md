# Reference activation surface

**Optional. Unsupported. Not part of the template.**

`onboarding.md` specifies what Zi already knows when someone says hello, and the
short entry flow that produces it. That flow is a web app, and a NanoClaw template
ships no web app — so the contract had nothing concrete behind it. This directory
is the shape of the missing half, in two files an operator can read in ten minutes
and replace with their own.

Zi's side is already implemented and needs none of this: arriving in context and
never re-asking is in the `onboarding-continuity` skill. An operator with no entry
surface can skip this entirely — Zi gathers the same context through conversation.

Nothing here is on the acceptance gate in `VM_ACCEPTANCE.md`.

| File | What it is |
|---|---|
| `index.html` | The four screens from `onboarding.md`: identity, interests, context, intent and consent. One self-contained file |
| `deep-link.mjs` | Token issuing and redemption, the handoff payload, and the deep link — the server side |

## The page

Open `index.html` in a browser. It works from the filesystem, and **the network tab
stays empty**: no script src, no stylesheet link, no web font, no analytics, no
`fetch`, no beacon, no storage. That is deliberate and tested
(`tests/reference.test.mjs`) — an onboarding page that phones somewhere is a privacy
notice nobody wrote.

It ends by printing the handoff payload rather than sending it. A browser cannot
hold the linking secret, so issuing the token is a server's job.

## The server side

```js
import { issueToken, redeemToken, deepLink, handoffPayload } from './deep-link.mjs';

const { token, record } = issueToken(user_id);   // store `record`, not `token`
const url = deepLink({ base: process.env.CHANNEL_LINK, token });
```

On arrival, redeem once:

```js
const result = redeemToken(record, presented, { source: 'link' });
if (!result.ok) startIdentificationOver(result.reason);
```

## The token rules, and why they are in code

`onboarding.md` calls the linking token a credential. This implements every clause
of that, because a rule stated only in prose is a rule the next person reimplements
wrongly:

- **Short-lived** — ten minutes by default.
- **Single-use** — redeeming consumes the record; a replay is refused.
- **Never stored raw** — only a SHA-256 hash is kept, and the comparison is
  constant-time.
- **Never logged or echoed** — `redact()` strips it from anything heading for a log
  line or a draft.
- **Never accepted from message content** — `redeemToken` requires `source: 'link'`
  and refuses anything else outright, however plausible the message looks. This is
  the injection path: a token pasted into a chat is exactly what an attacker
  supplies.
- **Expired or used means start over** — never "probably fine".

It is a *linking* credential and nothing more. It identifies; it authorizes nothing,
grants no permission, and lowers no approval level.

## What it is not

- Not a hosted product. No server, no storage, no rate limiting, no abuse
  handling, no accessibility audit. Bring your own.
- Not a consent record. The page collects two separate permissions
  (personalization, matching) and neither is permission to share anyone's details
  — that is a third consent, asked per transfer. `reference/data-layer/consent.mjs`
  holds the gate that enforces the distinction at the store.
- Not styling you should ship. Replace it.
