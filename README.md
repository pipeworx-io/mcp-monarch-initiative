# mcp-monarch-initiative

Monarch Initiative MCP — biomedical knowledge graph.

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 673+ live data sources.

## Tools

| Tool | Description |
|------|-------------|
| `search` | Full-text node search. |
| `entity` | Single node by curie (e.g. "MONDO:0007947"). |
| `associations` | Associations involving an entity. |
| `phenotype_to_gene` | Genes annotated to a phenotype (HP:… id). |
| `gene_to_disease` | Diseases associated with a gene (NCBIGene:… or HGNC:… id). |

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

Or connect to the full Pipeworx gateway for access to all 673+ data sources:

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

- [All tools and guides](https://github.com/pipeworx-io/examples)
- [pipeworx.io](https://pipeworx.io)

## License

MIT
