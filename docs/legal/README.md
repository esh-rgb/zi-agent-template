# Legal and privacy templates

> **Engineering template — not legal advice and not a compliance claim.**
> Drafted for an operator and their counsel to adapt. Installing Zi does not make
> any deployment compliant with any law. Review before production use.

These files describe what an operator must decide, document and be able to honor.
They are written as engineering requirements, not as finished notices.

| File | Covers |
|---|---|
| `PRIVACY_NOTICE_TEMPLATE.md` | What to tell people about data you hold |
| `AI_DISCLOSURE.md` | When and how Zi identifies itself as an AI |
| `DATA_RIGHTS.md` | Access, correction, export, deletion, objection |
| `DATA_RETENTION.md` | How long each class is kept |
| `CONNECTOR_PERMISSIONS.md` | Which third parties receive what |
| `SECURITY_AND_TRUST_MODEL.md` | Where enforcement is real |
| `COOKIES_AND_WEB_TRACKING_TEMPLATE.md` | Only if you run a web surface |
| `DISCLAIMER_TEMPLATE.md` | Limits of community information |
| `GDPR_READINESS_CHECKLIST.md` | Engineering readiness, not certification |
| `CHILDREN_AND_SENSITIVE_DATA_CONSIDERATIONS.md` | Higher-risk categories |
| `../../THIRD_PARTY_NOTICES.md` | Third-party components |

## Privacy by design — what the template actually does

Purpose limitation (Zi acts on the community's stated purposes) · data minimization
(handoffs carry minimum context; referrals carry consented fields only) · context
isolation (separate agent groups) · least privilege (read-only scopes by default) ·
short retention for raw conversation by default · explicit consent before personal
data leaves · audit of sensitive actions · no secrets in memory · no assumption that
user data trains any model · deletion reaching derived personal material.

## What the operator must still do

Identify the controller · establish a lawful basis · publish a real notice · name a
contact for privacy requests · define retention for their jurisdiction · assess each
connector · decide on minors and special categories · keep records of consent where
required · have counsel review it.
