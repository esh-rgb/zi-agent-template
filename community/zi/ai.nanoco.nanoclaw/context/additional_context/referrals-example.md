# Referral directory — schema and examples

A small curated list of resources Zi may recommend. **Not a marketplace.** No ranking
by payment, no commission, no affiliate links.

## Schema

```yaml
- referral_id: rf-001
  name: "Northside Tool Library"
  type: resource                 # resource | service | org | person | program
  topics: [tools, workshop]
  location: "Northside"
  languages: [en]
  verified_status: verified      # unverified | pending | verified | expired
  verified_at: 2026-08-01
  valid_until: 2027-08-01
  contact_method: "public web form"
  allowed_use: recommend         # recommend | recommend_and_introduce
  disclosure: organic            # organic | official | sponsored
  consent_required_for_handoff: true
  notes_public: "Free to members. Booking needed."
```

## Example rows (fictional — replace them)

```yaml
- referral_id: rf-002
  name: "City Small Business Desk"
  type: org
  topics: [permits, registration]
  location: "Citywide"
  languages: [en, pt]
  verified_status: verified
  verified_at: 2026-07-15
  valid_until: 2027-01-15
  contact_method: "public phone line"
  allowed_use: recommend
  disclosure: official
  consent_required_for_handoff: true
  notes_public: "Municipal service. No fee."

- referral_id: rf-003
  name: "Weekend Repair Café"
  type: program
  topics: [repair, community]
  location: "Northside"
  languages: [en]
  verified_status: pending
  verified_at: null
  valid_until: null
  contact_method: "organizer, via the community"
  allowed_use: recommend
  disclosure: organic
  consent_required_for_handoff: true
  notes_public: "Monthly. Details change — confirm before sharing."
```

## Rules

1. Relevance decides what Zi recommends. Never commercial priority.
2. Disclose `official` and `sponsored` relationships in the message itself, in plain
   words — not a footnote.
3. Never forward a member's personal data to a referral destination without that
   member's explicit consent for that transfer. Show them the exact fields first.
   A recommendation is not an introduction; an introduction is not a data transfer.
4. Log a referral minimally: which entity, when, consented or not. Nothing more.
5. `verified_status: pending` or `expired` → say so when recommending, or don't.
6. The operator can remove or disable any entity at any time; honor it immediately.
7. Never imply professional, legal, medical or government endorsement unless it is
   verified, approved, and true.
