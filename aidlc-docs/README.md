# aidlc-kit — AI-DLC Project

| Field | Value |
|-------|-------|
| Project | aidlc-kit |
| Mode | greenfield |
| Platform | Azure |
| Tier | standard |
| Created | 2026-03-31 |
| Team | (list team members and roles) |
| Facilitator | (name) |

---

## IDE Setup

Router files were generated for your AI coding assistant(s). The router tells the AI agent where to find prompts and artifacts, so you can request rituals by name instead of pasting prompts manually.

| IDE | Router File |
|-----|-------------|
| Copilot | `.github/copilot-instructions.md` |

**How to use:** Open your project in the IDE and ask your AI assistant:

- "Start Mob Elaboration"
- "Start Mob Construction"
- "Run a consistency check"
- "Check bolt completion criteria"

## Folder Guide

| Folder | Purpose |
|--------|---------|
| `intents/` | High-level feature descriptions that drive Mob Elaboration |
| `prompts/` | AI-DLC prompt templates (used automatically by IDE routers, or paste manually) |
| `mob-elaboration/` | Mob Elaboration outputs: plan, stories, units, NFRs |
| `mob-construction/` | Per-bolt outputs: domain model, logical design, code |
| `code-elevation/` | (Brownfield) Code Elevation outputs: static/dynamic models, tech debt |
| `decisions/` | Decision log with architectural decisions |
| `completion/` | Completion prompts: bolt criteria, consistency check, intent consolidation |
| `plan-templates/` | Blank plan templates for Mob Elaboration and Mob Construction |
| `standards/` | Content validation rules, error handling, question format |
| `audit/` | Session audit log (actions, decisions, artifacts created) |
| `retrospectives/` | Post-session retrospective template |
| `intent-summaries/` | Cross-intent context summaries (populated by intent consolidation) |
| `extensions/` | Cross-cutting rules (e.g. security) enforced automatically by the AI. See `extensions/README.md` |
| `archive/` | Completed intents moved here for historical reference |

## Workflow

1. Open your AI coding assistant and ask: "Start Mob Elaboration"
   (the AI will ask for your intent — or read it from `intents/intent-primary.md` if you wrote one ahead of time)
2. (Brownfield only) Run Code Elevation to analyze the existing codebase
3. Mob Elaboration breaks the intent into stories, units, and bolts
4. Start Mob Construction bolt by bolt
5. Between bolts: run a consistency check or validate bolt completion criteria
6. After all bolts: run intent consolidation, then archive to `archive/`
