interface McpToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, unknown>;
    required?: string[];
  };
}

interface McpToolExport {
  tools: McpToolDefinition[];
  callTool: (name: string, args: Record<string, unknown>) => Promise<unknown>;
  meter?: { credits: number };
  cost?: Record<string, unknown>;
  provider?: string;
}

/**
 * Monarch Initiative MCP — biomedical knowledge graph.
 *
 * Auth: none. Docs: https://api.monarchinitiative.org/v3/docs
 */


const BASE = 'https://api.monarchinitiative.org/v3/api';
const UA = 'pipeworx-mcp-monarch-initiative/1.0 (+https://pipeworx.io)';

const tools: McpToolExport['tools'] = [
  {
    name: 'search',
    description: 'Full-text node search.',
    inputSchema: {
      type: 'object',
      properties: {
        query: { type: 'string' },
        category: { type: 'string', description: 'biolink:Disease | biolink:Gene | biolink:PhenotypicFeature | …' },
        limit: { type: 'number', description: '1-500 (default 20)' },
        offset: { type: 'number' },
      },
      required: ['query'],
    },
  },
  {
    name: 'entity',
    description: 'Single node by curie (e.g. "MONDO:0007947").',
    inputSchema: {
      type: 'object',
      properties: { id: { type: 'string' } },
      required: ['id'],
    },
  },
  {
    name: 'associations',
    description: 'Associations involving an entity.',
    inputSchema: {
      type: 'object',
      properties: {
        entity_id: { type: 'string' },
        category: { type: 'string', description: 'e.g. "biolink:DiseaseToPhenotypicFeatureAssociation"' },
        predicate: { type: 'string', description: 'e.g. "biolink:has_phenotype"' },
        direction: { type: 'string', description: 'subject (default) | object | both' },
        limit: { type: 'number' },
      },
      required: ['entity_id'],
    },
  },
  {
    name: 'phenotype_to_gene',
    description: 'Genes annotated to a phenotype (HP:… id).',
    inputSchema: {
      type: 'object',
      properties: { phenotype_id: { type: 'string' } },
      required: ['phenotype_id'],
    },
  },
  {
    name: 'gene_to_disease',
    description: 'Diseases associated with a gene (NCBIGene:… or HGNC:… id).',
    inputSchema: {
      type: 'object',
      properties: { gene_id: { type: 'string' } },
      required: ['gene_id'],
    },
  },
];

async function callTool(name: string, args: Record<string, unknown>): Promise<unknown> {
  switch (name) {
    case 'search': {
      const params = new URLSearchParams({
        q: reqStr(args, 'query', '"Marfan syndrome"'),
        limit: String(Math.min(500, Math.max(1, (args.limit as number) ?? 20))),
        offset: String(Math.max(0, (args.offset as number) ?? 0)),
      });
      if (args.category) params.set('category', String(args.category));
      return mGet(`/search?${params}`);
    }
    case 'entity':
      return mGet(`/entity/${encodeURIComponent(reqStr(args, 'id', '"MONDO:0007947"'))}`);
    case 'associations': {
      const params = new URLSearchParams({
        entity: reqStr(args, 'entity_id', '"MONDO:0007947"'),
        limit: String(Math.min(500, Math.max(1, (args.limit as number) ?? 20))),
      });
      if (args.category) params.set('category', String(args.category));
      if (args.predicate) params.set('predicate', String(args.predicate));
      if (args.direction) params.set('direction', String(args.direction));
      return mGet(`/association?${params}`);
    }
    case 'phenotype_to_gene':
      return mGet(
        `/association?subject=${encodeURIComponent(reqStr(args, 'phenotype_id', '"HP:0001250"'))}&category=biolink:GeneToPhenotypicFeatureAssociation&direction=object&limit=200`,
      );
    case 'gene_to_disease':
      return mGet(
        `/association?subject=${encodeURIComponent(reqStr(args, 'gene_id', '"NCBIGene:7157"'))}&category=biolink:GeneToDiseaseAssociation&limit=200`,
      );
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

async function mGet(path: string): Promise<unknown> {
  const res = await fetch(`${BASE}${path}`, { headers: { Accept: 'application/json', 'User-Agent': UA } });
  if (res.status === 404) throw new Error('Monarch: not found');
  if (!res.ok) throw new Error(`Monarch: ${res.status} ${await res.text().then((t) => t.slice(0, 200))}`);
  return res.json();
}

function reqStr(args: Record<string, unknown>, key: string, example: string): string {
  const v = args[key];
  if (typeof v !== 'string' || !v.trim()) {
    throw new Error(`Required argument "${key}" is missing. Pass a string like ${example}.`);
  }
  return v;
}

export default { tools, callTool, meter: { credits: 1 } } satisfies McpToolExport;
