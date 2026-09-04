# Example connector — calendar

The one worked example: a Level B action where the person, not the operator,
authorizes each write.

## Declaration

```yaml
name: calendar
capabilities: [list_calendars, list_events, create_event, free_busy]
read_scopes:  [calendar.readonly]
write_scopes: [calendar.events]
required_secrets: []          # OAuth handled by the credential proxy
approval_class: B
risk_class: reversible        # the person can delete the entry themselves
rate_limits: "per provider"
health: healthy
```

## Install

On a NanoClaw host, `/add-gcal-tool` installs a Google Calendar MCP server with
proxy-managed OAuth. No raw token reaches the container; the proxy injects it per
request, matched by API host. Any equivalent calendar MCP server works — the
contract above is what matters, not the vendor.

This template declares no MCP server for it, so nothing breaks if it is absent:
`calendar-action` checks connector health and, if unavailable, offers the event
details for the person to add manually.

## Flow

```
VERIFIED event exists
  → member asks what's happening, or Zi finds it relevant
  → Zi offers it once, with the reason it is relevant
  → member explicitly confirms THIS event
  → create_event with calendar fields only
  → audit record
```

## Field mapping

| Event record | Calendar field |
|---|---|
| title | summary |
| start / end + community timezone | start / end |
| location or link | location |
| one-line description + source link | description |

Nothing else crosses. No marketing copy, no tracking parameters, no extra guests, no
reminders or recurrence the person did not ask for.

## Failure

Connector unavailable → say so, offer the details manually.
Write rejected → report it failed; do not retry silently.
Ambiguous confirmation → ask once more, plainly. Never guess a yes.

## Never

Write without a current, explicit confirmation. Treat membership, enthusiasm, or a
previous yes as consent. Write to anyone's calendar but the person in the
conversation. Modify or delete entries you were not asked to touch. Let a scheduled
task trigger a write.
