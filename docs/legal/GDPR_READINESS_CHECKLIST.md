# GDPR readiness checklist

> **Engineering template — not legal advice and not a compliance claim.**
> Drafted for an operator and their counsel to adapt. Installing Zi does not make
> any deployment compliant with any law. Review before production use.

**This is an engineering readiness checklist. It is not a compliance assessment,
not a certification, and not a substitute for a DPO or counsel.** Passing every line
does not make a deployment GDPR-compliant.

## What the template provides

- [x] Data minimization — handoffs carry minimum context; referrals carry consented fields only
- [x] Purpose limitation — Zi acts on stated community purposes
- [x] Storage limitation — short default retention for raw conversation; curated memory
- [x] Transparency — AI disclosure and a plain description of what is held
- [x] Access — "what do you remember about me?"
- [x] Rectification — corrections applied immediately
- [x] Erasure — deletion including derived personal material
- [x] Portability — export in a readable form
- [x] Withdraw consent — personalization off, Zi still usable
- [x] Objection — honored, with consequences stated
- [x] No automated decisions with legal or similarly significant effects
- [x] Human contact and escalation path
- [x] Security — credentials never in the container; sensitive actions audited
- [x] Privacy by design — context isolation, least privilege, consent before transfer

## What the operator must supply

- [ ] Identify the controller (and processors)
- [ ] Establish and document a lawful basis
- [ ] Publish a real privacy notice
- [ ] Name a privacy contact; appoint a DPO if required
- [ ] Record of processing activities
- [ ] DPIA if the processing warrants one
- [ ] Assess each connector, including international transfers
- [ ] Processor agreements where required
- [ ] Retention periods for the jurisdiction
- [ ] Records of consent
- [ ] Breach notification procedure
- [ ] Decide on minors and special categories
- [ ] Legal review before production

Unticked boxes in the second list mean the deployment is not ready, regardless of
what the first list shows.
