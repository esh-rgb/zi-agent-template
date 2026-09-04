# Reference community data layer

**Optional. Unsupported. Not part of the template.**

`ops/zi` ships no database and does not require one. `data-layer.md` specifies the
schema and the rules Zi expects; this directory is *one* way to satisfy that
specification, so an operator has something concrete to point at instead of a
paragraph. An operator may wire this, wire their own store, or wire nothing — Zi
works from conversation and memory either way, and says so rather than implying it
has a directory it does not have.

Nothing here is on the acceptance gate in `VM_ACCEPTANCE.md`.

## What it is

| File | What it does |
|---|---|
| `schema/*.schema.json` | One JSON Schema per entity in `data-layer.md`. `common.schema.json` holds the shared fragments — provenance, the status model, the id shape |
| `validate.mjs` | A ~150-line JSON Schema validator covering only the keywords these schemas use. Also the `npm run validate:reference` entry point |
| `store.mjs` | File-backed store: fetch by reference, consent-gated disclosure, provenance stamping, append-only audit log |
| `consent.mjs` | The consent gate on its own, so the rule is readable without the storage around it |
| `mcp-server.mjs` | The store as an MCP server over stdio |
| `seed/` | A fictional community — Northside Makers, the same one as `config-example.md` |

Standard library only. No dependencies, and it should stay that way.

## Run it

```bash
node reference/data-layer/validate.mjs          # seed against the schemas
npm run validate:reference                      # the same thing, from the repo root
```

Drive the MCP server by hand — newline-delimited JSON-RPC on stdin:

```bash
printf '%s\n' '{"jsonrpc":"2.0","id":1,"method":"tools/list"}' \
  | node reference/data-layer/mcp-server.mjs
```

## Wire it into an install

The template's own `ops/zi/mcp.json` stays `{"mcpServers":{}}` — it declares no
servers and needs no keys. On **your** install, after stamping, add:

```json
{
  "mcpServers": {
    "community": {
      "command": "node",
      "args": ["/abs/path/to/reference/data-layer/mcp-server.mjs"],
      "env": {
        "ZI_DATA_DIR": "/abs/path/to/your/community-data",
        "ZI_AUDIT_LOG": "/abs/path/to/your/community-data/audit.jsonl"
      }
    }
  }
}
```

Point `ZI_DATA_DIR` at your own directory of `*.json` collection files. Do not edit
the seed and call it your community.

Scope one store per community, and give the operator group and the member group
data scoped to what each is entitled to see. Two agent groups reading one
unscoped store is one trust boundary wearing two names — `docs/trust-model.md`
states the consequence.

## The five rules it implements

1. **Fetch by reference.** `get(entity, id)` and `query(entity, where)`. There is
   deliberately no "everything known about this person" call.
2. **No record, no transfer.** Personal fields leave only through `disclose()`,
   which requires a `Consent` record covering that purpose, that recipient and
   those fields. A membership is not a consent; a withdrawn or expired one is not
   a current one; a consent for `matching` is not a consent for `introduction`.
3. **Records carry provenance.** `put()` refuses a record without it.
4. **No machine-assigned verification.** `community_record` refuses `VERIFIED`,
   `APPROVED` and `PUBLISHED`. Only a named human verifier moves an item there.
5. **The audit log is append-only.** Including refusals — a denied disclosure is
   worth as much in a log as a permitted one.

## What it is not

- **Not enforcement.** It governs what the *store* hands over. It cannot stop a
  model from repeating something already in its context, and it is not access
  control. `docs/trust-model.md` distinguishes runtime-enforced from behavioral;
  this sits on the behavioral side of that line, with the store as one honest
  chokepoint.
- **Not an approval path.** A permitted disclosure is still a Level C action
  needing a human. Reaching data through an MCP server does not lower an approval
  level — `connectors/contract/README.md`, rule 2.
- **Not production storage.** JSON files read into memory, no concurrency control,
  no encryption at rest, no migrations. It is a reference for the shape.
- **Not a retention policy.** `forget(user_id)` removes what this store holds,
  which is the privacy right from `privacy-controls` and explicitly *not* an
  external delete. Retention windows are an operator's to configure —
  `docs/legal/DATA_RETENTION.md`.
