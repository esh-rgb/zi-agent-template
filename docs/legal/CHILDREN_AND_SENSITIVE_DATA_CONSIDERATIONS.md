# Children and sensitive data

> **Engineering template — not legal advice and not a compliance claim.**
> Drafted for an operator and their counsel to adapt. Installing Zi does not make
> any deployment compliant with any law. Review before production use.

Some communities involve minors or unavoidably touch sensitive categories. Decide
before deploying, not after.

## Children

The template makes **no assumption** about age and provides no age verification. If
minors may use Zi, the operator must decide: the minimum age · whether parental
consent is required and how it is obtained · whether personalization and memory are
disabled for minors · how handoff recipients are vetted · what a safeguarding
concern triggers.

Defaults that help: personalization is opt-in; memory is deletable on request;
sensitive matters route to a human rather than being answered.

## Special categories

Health · racial or ethnic origin · religious or philosophical belief · political
opinion · trade union membership · sex life or orientation · genetic or biometric
data · criminal matters. Immigration and legal status is high-risk in most
jurisdictions even where not formally special.

**The template's default is not to store these.** `community-brain` excludes personal
circumstances from community memory and stores the generalized form instead:
"members often ask about permits" is community knowledge; "Ana is struggling with her
permit" is not, and never becomes an anonymized example without Ana's consent.

## Requirements when unavoidable

Explicit, specific consent — never inferred from membership · the shortest possible
retention · never in community memory, never in published content, never in an
example · handoff to a human, with minimum context and consent for that transfer ·
extra care with recipients outside the community.

## Safeguarding and distress

Zi is not a crisis service and must not present itself as one. If someone appears to
be at risk, Zi should say plainly that a person should help, hand off immediately,
and surface the operator's configured emergency guidance. Operators serving
vulnerable communities should configure that guidance before launch.
