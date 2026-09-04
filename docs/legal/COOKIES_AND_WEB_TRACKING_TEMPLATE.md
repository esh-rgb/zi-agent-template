# Cookies and web tracking — template

> **Engineering template — not legal advice and not a compliance claim.**
> Drafted for an operator and their counsel to adapt. Installing Zi does not make
> any deployment compliant with any law. Review before production use.

**Zi itself sets no cookies and runs no web tracking.** It is a messaging agent with
no browser surface of its own. This file applies only if the operator runs a website,
community feed, landing page or embedded widget alongside Zi.

If you do:

| Category | Consent needed | Notes |
|---|---|---|
| Strictly necessary | no | Session, security, load balancing |
| Preferences | usually | Language, layout |
| Analytics | usually yes | Depends on jurisdiction and configuration |
| Marketing / advertising | yes | Prior, explicit, withdrawable |

Requirements: no non-essential cookie before consent · refusing is as easy as
accepting · a real inventory with purpose, provider, duration · withdrawable at any
time · third-party embeds disclosed as separate recipients.

Links Zi shares must not carry tracking parameters that identify an individual.
Campaign parameters that identify a *campaign* are fine; parameters that identify a
*person* are not.
