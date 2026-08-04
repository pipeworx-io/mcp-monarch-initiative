# @pipeworx/monarch-initiative

[Monarch Initiative](https://monarchinitiative.org) MCP — biomedical knowledge graph linking diseases, phenotypes, genes, and variants across species. Keyless.

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 1394+ live data sources.

## Tools

- `search(query, category?, limit?, offset?)` — full-text node search
- `entity(id)` — single node by curie (e.g. `MONDO:0007947`)
- `associations(entity_id, category?, predicate?, direction?, limit?)` — associations involving an entity
- `phenotype_to_gene(phenotype_id)` — gene candidates for a phenotype (HP:…)
- `gene_to_disease(gene_id)` — diseases associated with a gene

## Data source

`https://api.monarchinitiative.org/v3/api/`

## Quick Start

Add to your MCP client (Claude Desktop, Cursor, Windsurf, etc.):

```json
{
  "mcpServers": {
    "monarch-initiative": {
      "url": "https://gateway.pipeworx.io/monarch-initiative/mcp"
    }
  }
}
```

Or connect to the full Pipeworx gateway for access to all 1394+ data sources:

```json
{
  "mcpServers": {
    "pipeworx": {
      "url": "https://gateway.pipeworx.io/mcp"
    }
  }
}
```

## Using with ask_pipeworx

Instead of calling tools directly, you can ask questions in plain English:

```
ask_pipeworx({ question: "your question about Monarch Initiative data" })
```

The gateway picks the right tool and fills the arguments automatically.

## More

- [Docs and guides](https://pipeworx.io/docs)
- [pipeworx.io](https://pipeworx.io)

## License

MIT
