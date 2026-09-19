#!/usr/bin/env node
/**
 * Linking tokens and the channel deep link, from `onboarding.md`.
 *
 * Optional and unsupported. A template ships no web app; this is the shape of the
 * handoff, not a hosted service. An operator supplies the hosting, the storage and
 * the issuing endpoint.
 *
 * The token is a linking credential. `onboarding.md` states the rules and this
 * file implements them:
 *
 *   - short-lived and single-use;
 *   - never logged, never repeated back to the person, never echoed into a draft;
 *   - never accepted from message content -- only from the link itself;
 *   - expired or already used means start the identification over, not
 *     "probably fine".
 *
 * It ties a channel identity to the `user_id` onboarding just created. It is not
 * an authorization token: it grants no permission and lowers no approval level.
 */
import crypto from 'node:crypto';

/** Ten minutes. Long enough to open a chat app, short enough to be worth little. */
export const DEFAULT_TTL_MS = 10 * 60 * 1000;

/**
 * Issue a token for one `user_id`.
 *
 * Returns the token once, plus the record to store. The record holds only a hash:
 * a store that keeps the raw token is a store that can leak it.
 */
export function issueToken(user_id, { ttlMs = DEFAULT_TTL_MS, now = Date.now() } = {}) {
  const token = crypto.randomBytes(24).toString('base64url');
  return {
    token,
    record: {
      user_id,
      token_hash: hash(token),
      issued_at: new Date(now).toISOString(),
      expires_at: new Date(now + ttlMs).toISOString(),
      used_at: null,
    },
  };
}

const hash = (token) => crypto.createHash('sha256').update(token).digest('hex');

/**
 * Redeem a token presented by an arriving channel identity.
 *
 * Fails closed on every path it cannot positively justify, and consumes the record
 * on success so a second presentation fails. `source` must be `'link'`: a token
 * that arrived inside a message is refused outright, however plausible it looks.
 */
export function redeemToken(record, token, { source = 'link', now = Date.now() } = {}) {
  if (source !== 'link') {
    return deny('a token that arrived in message content is never accepted');
  }
  if (!record) return deny('unknown token — start the identification over');
  if (record.used_at) return deny('token already used — start the identification over');
  if (Date.parse(record.expires_at) <= now) {
    return deny('token expired — start the identification over');
  }
  // Constant-time: the comparison itself should not leak the value.
  const presented = Buffer.from(hash(token), 'hex');
  const stored = Buffer.from(record.token_hash, 'hex');
  if (presented.length !== stored.length || !crypto.timingSafeEqual(presented, stored)) {
    return deny('token does not match — start the identification over');
  }
  return {
    ok: true,
    user_id: record.user_id,
    consumed: { ...record, used_at: new Date(now).toISOString() },
  };
}

const deny = (reason) => ({ ok: false, reason, user_id: null, consumed: null });

/**
 * Build the deep link the last onboarding screen sends the person to.
 *
 * The token rides in the link and nowhere else. Anything else you want the agent
 * to know belongs in the profile it will fetch by `user_id`, not in the URL.
 */
export function deepLink({ base, token }) {
  if (!base) throw new Error('no channel base link configured');
  const url = new URL(base);
  url.searchParams.set('t', token);
  return url.toString();
}

/**
 * The "minimum viable context" handoff payload from `onboarding.md`. Enough to
 * start a useful conversation, never a complete profile -- the rest accumulates
 * through use.
 */
export function handoffPayload(answers, { user_id }) {
  return {
    user_id,
    first_name: answers.first_name,
    preferred_language: answers.preferred_language,
    location: answers.location,
    journey_stage: answers.journey_stage,
    interests: answers.interests ?? [],
    looking_for: answers.looking_for,
    can_offer: answers.can_offer ?? null,
    consent: {
      personalized_recommendations: Boolean(answers.consent_personalization),
      matching: Boolean(answers.consent_matching),
      granted_at: new Date().toISOString(),
    },
    arrived_via: answers.arrived_via ?? 'link',
  };
}

/** Never log the token. Redact before anything reaches a log line or a draft. */
export function redact(value) {
  return typeof value === 'string' ? value.replace(/([?&]t=)[^&\s]+/g, '$1[redacted]') : value;
}
