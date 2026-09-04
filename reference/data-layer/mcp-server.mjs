#!/usr/bin/env node
/**
 * Reference MCP server over the file-backed community data layer.
 *
 * Optional and unsupported. The template's own `ops/zi/mcp.json` stays
 * `{"mcpServers":{}}` and declares no credentials; an operator who wants a data
 * layer adds this (or their own) on their install. See README.md here first.
 *
 * Two properties are deliberate and tested:
 *
 *   1. It needs no credentials. There is no token, key or environment secret in
 *      this file, and nothing to inject: the store is a local directory.
 *   2. It exposes no externally-visible write. Every tool below either reads, or
 *      writes a record that only this store can see. Nothing here sends, publishes,
 *      writes a calendar, contacts anyone, or moves an item to VERIFIED, APPROVED
 *      or PUBLISHED. A connector cannot be turned into an approval bypass by
 *      reaching it through the data layer.
 *
 * Transport: newline-delimited JSON-RPC 2.0 on stdin/stdout, standard library only.
 */
import readline from 'node:readline';
import { Store } from './store.mjs';

const PROTOCOL_VERSION = '2025-06-18';

/** Statuses a machine may not assign. Only a named human verifier moves an item on. */
const HUMAN_ONLY_STATUS = new Set(['VERIFIED', 'APPROVED', 'PUBLISHED']);

const store = new Store({
  dir: process.env.ZI_DATA_DIR || undefined,
  auditLog: process.env.ZI_AUDIT_LOG || null,
});

const TOOLS = [
  {
    name: 'community_get',
    description:
      'Fetch one record by its own id. Fetch by reference: pass the id you were given, not a description.',
    inputSchema: {
      type: 'object',
      required: ['entity', 'id'],
      properties: {
        entity: { type: 'string', description: 'person, event, organization, ...' },
        id: { type: 'string' },
      },
    },
    handler: ({ entity, id }) => store.get(entity, id),
  },
  {
    name: 'community_query',
    description:
      'Find community-level records by exact field match. Returns no personal fields about another person -- use community_disclose for that.',
    inputSchema: {
      type: 'object',
      required: ['entity'],
      properties: {
        entity: { type: 'string' },
        where: { type: 'object', description: 'field -> value, all must match' },
      },
    },
    handler: ({ entity, where }) => store.query(entity, where ?? {}),
  },
  {
    name: 'community_entities',
    description: 'List the entity types this store holds, and how many records each has.',
    inputSchema: { type: 'object', properties: {} },
    handler: () =>
      Object.fromEntries(store.entities().map((e) => [e, store.list(e).length])),
  },
  {
    name: 'community_disclose',
    description:
      'Request personal fields about one person for one stated purpose. Refuses unless a Consent record covers that purpose, recipient and field set. A refusal is an answer: relay the reason and ask the person.',
    inputSchema: {
      type: 'object',
      required: ['entity', 'id', 'purpose', 'fields'],
      properties: {
        entity: { type: 'string' },
        id: { type: 'string' },
        purpose: { type: 'string' },
        fields: { type: 'array', items: { type: 'string' } },
        recipient_ref: { type: 'string' },
      },
    },
    handler: (args) => store.disclose(args.entity, args.id, args),
  },
  {
    name: 'community_record',
    description:
      'Write a record this store alone can see. Refuses a record with no provenance, and refuses to assign VERIFIED, APPROVED or PUBLISHED -- only a named human verifier moves an item there.',
    inputSchema: {
      type: 'object',
      required: ['entity', 'record'],
      properties: {
        entity: { type: 'string' },
        record: { type: 'object' },
      },
    },
    handler: ({ entity, record }) => {
      if (HUMAN_ONLY_STATUS.has(record?.status)) {
        throw new Error(
          `status "${record.status}" is reachable only by a named human verifier, not by this tool`,
        );
      }
      return store.put(entity, record);
    },
  },
];

const byName = new Map(TOOLS.map((t) => [t.name, t]));

/** The advertised tool list, without the handlers. */
export function toolManifest() {
  return TOOLS.map(({ name, description, inputSchema }) => ({ name, description, inputSchema }));
}

function handle(request) {
  const { id, method, params } = request;
  const ok = (result) => ({ jsonrpc: '2.0', id, result });
  const err = (code, message) => ({ jsonrpc: '2.0', id, error: { code, message } });

  switch (method) {
    case 'initialize':
      return ok({
        protocolVersion: PROTOCOL_VERSION,
        capabilities: { tools: {} },
        serverInfo: { name: 'zi-community-data-layer', version: '1.0.0' },
      });
    case 'tools/list':
      return ok({ tools: toolManifest() });
    case 'tools/call': {
      const tool = byName.get(params?.name);
      if (!tool) return err(-32602, `unknown tool: ${params?.name}`);
      try {
        const result = tool.handler(params.arguments ?? {});
        return ok({ content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] });
      } catch (error) {
        // Fail closed and say so. Never report a partial write as success.
        return ok({
          content: [{ type: 'text', text: `refused: ${error.message}` }],
          isError: true,
        });
      }
    }
    case 'ping':
      return ok({});
    default:
      return method?.startsWith('notifications/') ? null : err(-32601, `unknown method: ${method}`);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const rl = readline.createInterface({ input: process.stdin });
  rl.on('line', (line) => {
    if (!line.trim()) return;
    let response;
    try {
      response = handle(JSON.parse(line));
    } catch {
      response = { jsonrpc: '2.0', id: null, error: { code: -32700, message: 'parse error' } };
    }
    if (response) process.stdout.write(`${JSON.stringify(response)}\n`);
  });
}

export { handle, HUMAN_ONLY_STATUS };
