# MCP Server Recommendations

> MCP (Model Context Protocol) servers give your AI coding assistant access to
> official documentation, API references, and platform knowledge. This reduces
> hallucinated API signatures and improves architectural decisions.

## Recommended Servers

These are vendor-published servers with clear trust chains.

| Server | Publisher | Purpose |
|--------|-----------|---------|
| Context7 | Upstash | Library API docs; prevents hallucinated signatures |
| microsoft-learn | Microsoft | Azure service docs, SDK references |

**Optional** (improve quality but not required):

| Server | Publisher | Purpose |
|--------|-----------|---------|
| Azure Bicep MCP Server | Microsoft | Bicep IaC: resource type schemas, ARM decompilation, diagnostics, Azure Verified Modules |
| Terraform MCP Server | HashiCorp | IaC provider schemas, resource definitions |
| Pulumi MCP Server | Pulumi | IaC registry docs, infrastructure patterns |

## When Each Server Helps

| Ritual Phase | MCP Benefit |
|-------------|-------------|
| Elaboration — Risk & NFR Analysis | Azure docs: validate architecture against Well-Architected best practices |
| Elaboration — Bolt Planning | Azure docs: verify services exist in target region, check quotas |
| Construction — Logical Design | Azure docs: validate infra patterns, configuration options |
| Construction — Code Generation | Context7: verify library API signatures, method parameters |
| Code Elevation — Static Analysis | Context7: understand existing library APIs |
| Code Elevation — Dynamic Analysis | Azure docs: validate current infra against best practices |

## Finding Additional Servers

The servers above cover Azure documentation and code API verification.
For other needs, search the [Official MCP Registry](https://github.com/modelcontextprotocol/registry):

- **UI-heavy intents**: design tool servers (Figma, Storybook)
- **Database-specific operations**: Postgres, MongoDB, Redis servers
- **CI/CD integrations**: GitHub Actions, GitLab CI servers
- **Monitoring**: observability platform servers

## Trust Guidance

MCP servers get full tool access inside your AI session. Trust matters.

- **Prefer vendor-published servers** — check the publisher/org on GitHub
- **Be cautious with community servers** — review source code before installing
- **Install at project scope** — not global; different projects need different tools
- **Review permissions** — understand what data the server can access

## Cross-Platform Troubleshooting (WSL ↔ Windows)

If you scaffolded this project on WSL/Linux but open it in an IDE on Windows (or vice versa), MCP server commands may fail with **"program not found"**.

**Symptom:** `uvx awslabs.aws-documentation-mcp-server@latest` → `Failed to spawn: program not found`

**Cause:** The `uvx` shorthand works on Linux but not on Windows for `awslabs.*` packages because the package name and executable name don't match.

**Fix for Windows:** In your IDE's MCP config, change:
```json
"command": "uvx",
"args": ["awslabs.aws-documentation-mcp-server@latest"]
```
to:
```json
"command": "uv",
"args": ["tool", "run", "--from", "awslabs.aws-documentation-mcp-server@latest", "awslabs.aws-documentation-mcp-server.exe"]
```

The `.exe` suffix is required on Windows for all `awslabs.*` servers. Non-awslabs servers like `markitdown-mcp` work with plain `uvx` on both platforms.
