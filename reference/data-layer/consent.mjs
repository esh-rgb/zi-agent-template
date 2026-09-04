#!/usr/bin/env node
/**
 * The consent gate from `data-layer.md`.
 *
 *   Consent is an entity, not an assumption. Before any personal field crosses to
 *   another person, an organization or a channel, check for a Consent record
 *   covering *that* purpose. No record, no transfer -- ask the person instead.
 *   A membership is not a consent. An old consent for one purpose is not consent
 *   for a new one.
 *
 * This is a reference implementation of that rule, not enforcement of it. It
 * decides only what the *store* will hand over. It cannot stop a model from
 * saying something it already has in context, and nothing here replaces the
 * approval gate: a permitted transfer is still a Level C action needing a human.
 */

/** Purposes are a closed list, mirroring consent.schema.json. */
export const PURPOSES = [
  'personalized_recommendations',
  'matching',
  'introduction',
  'data_transfer_to_organization',
  'data_transfer_to_person',
  'community_digest',
  'referral_handoff',
];

/**
 * Purposes that name a specific recipient. A consent record for one of these
 * with no `recipient_ref` at all is not a wildcard covering anyone who asks --
 * it is an incomplete record, and is refused rather than silently passed.
 */
const RECIPIENT_SCOPED = new Set([
  'introduction',
  'data_transfer_to_organization',
  'data_transfer_to_person',
]);

/** Parse an RFC 3339 timestamp to milliseconds. String comparison is wrong
 * across differing UTC offsets -- a later instant can sort as an earlier
 * string -- so every comparison below goes through this first. */
const at = (iso) => Date.parse(iso);

/**
 * Decide whether `fields` about `user_id` may cross for `purpose`.
 *
 * Returns `{ allowed, reason, consent_id }`. `allowed: false` is the default for
 * every case this cannot positively justify -- unknown purpose, no record,
 * withdrawn, expired, wrong recipient, or a field outside the granted scope.
 *
 * @param {object[]} consents  Consent records, as stored.
 * @param {object}   request   { user_id, purpose, fields, recipient_ref?, now? }
 */
export function checkConsent(consents, request) {
  const { user_id, purpose, fields = [], recipient_ref, now = new Date().toISOString() } = request;

  if (!PURPOSES.includes(purpose)) {
    return deny(`"${purpose}" is not a recognized consent purpose`);
  }
  if (!user_id) return deny('no user_id given, so no consent can be found');
  if (fields.length === 0) return deny('no fields named; an unscoped transfer is never permitted');

  const candidates = consents.filter((c) => c.user_id === user_id && c.purpose === purpose);
  if (candidates.length === 0) {
    // The single most important branch: silence is not permission.
    return deny(`no Consent record for ${user_id} covering "${purpose}" -- ask the person`);
  }

  const nowMs = at(now);
  const reasons = [];
  for (const consent of candidates) {
    if (consent.withdrawn_at && at(consent.withdrawn_at) <= nowMs) {
      reasons.push(`${consent.consent_id} was withdrawn on ${consent.withdrawn_at}`);
      continue;
    }
    if (consent.expires_at && at(consent.expires_at) <= nowMs) {
      reasons.push(`${consent.consent_id} expired on ${consent.expires_at}`);
      continue;
    }
    // A recipient-scoped purpose with no recorded recipient is an incomplete
    // record, not a blanket grant -- it never matches, whoever asks.
    if (RECIPIENT_SCOPED.has(purpose) && !consent.recipient_ref) {
      reasons.push(`${consent.consent_id} names no recipient, and "${purpose}" requires one`);
      continue;
    }
    // A consent naming a recipient covers that recipient and no other.
    if (consent.recipient_ref && consent.recipient_ref !== recipient_ref) {
      reasons.push(
        `${consent.consent_id} covers a different recipient (${consent.recipient_ref})`,
      );
      continue;
    }
    const outside = fields.filter((f) => !consent.scope.includes(f));
    if (outside.length) {
      reasons.push(`${consent.consent_id} does not cover ${outside.join(', ')}`);
      continue;
    }
    return { allowed: true, reason: `covered by ${consent.consent_id}`, consent_id: consent.consent_id };
  }

  return deny(`no usable consent: ${reasons.join('; ')}`);
}

const deny = (reason) => ({ allowed: false, reason, consent_id: null });

/**
 * The personal fields the gate protects. Anything here is refused by default;
 * anything absent is community-level and needs no consent to surface.
 */
export const PERSONAL_FIELDS = new Set([
  'display_name', 'preferred_language', 'languages', 'location_id', 'journey_stage',
  'interests', 'channel_identities', 'personalization', 'contact_ref',
  'need_id', 'offer_id', 'detail', 'availability', 'urgency',
]);

/** Split a record's keys into what is personal and what is not. */
export function personalFields(record) {
  return Object.keys(record).filter((k) => PERSONAL_FIELDS.has(k));
}
