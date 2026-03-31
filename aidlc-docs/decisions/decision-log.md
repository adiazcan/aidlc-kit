# AI-DLC Decision Log Template

> **Version:** 2.0 | **Last Updated:** 2026-02-24  
> **Usage:** One file per session. Log every significant decision made during any AI-DLC ritual.  

---

## Session Info

| Field | Value |
|-------|-------|
| **Session Type** | Mob Elaboration |
| **Intent** | River Crossing Puzzle Web Application |
| **Date** | 2026-03-31 |
| **Participants** | Alberto Diaz (session lead) |
| **Facilitator** | GitHub Copilot |

---

## Decisions

### Decision 001
| Field | Detail |
|-------|--------|
| **Phase/Stage** | Mob Elaboration — Intent Clarification |
| **Decision** | Build only the classic wolf, goat, and cabbage river crossing puzzle in the first release. |
| **Context** | The initial intent left the exact puzzle variant open. |
| **Options Considered** | Single classic variant; different fixed variant; multiple selectable variants |
| **Rationale** | A single fixed variant keeps the first release focused and avoids unnecessary content and rule complexity. |
| **Trade-offs Accepted** | The app will not support multiple puzzle variants in the first release. |
| **Decided By** | Team consensus |
| **Compatibility Impact** | N/A |

---

### Decision 002
| Field | Detail |
|-------|--------|
| **Phase/Stage** | Mob Elaboration — Intent Clarification |
| **Decision** | Deliver the app as a static web application on Azure Static Web Apps with no backend services or third-party integrations. |
| **Context** | The deployment and integration boundary needed to be fixed before story generation. |
| **Options Considered** | Static app with provider unspecified; GitHub Pages; Azure Static Web Apps; backend-enabled architecture |
| **Rationale** | The app has no server-side requirements, and Azure Static Web Apps satisfies the chosen deployment target with minimal architecture overhead. |
| **Trade-offs Accepted** | No server-side persistence, analytics, or backend-driven features in the first release. |
| **Decided By** | Team consensus |
| **Compatibility Impact** | N/A |

---

### Decision 003
| Field | Detail |
|-------|--------|
| **Phase/Stage** | Mob Elaboration — Story Generation / Unit Division / Bolt Planning |
| **Decision** | Use one implementation unit and three sequential bolts, with puzzle logic isolated from UI and browser storage. |
| **Context** | The lightweight elaboration needed a buildable structure that preserves testability without over-fragmenting the work. |
| **Options Considered** | Multiple units and smaller bolts; one unit with one bolt; one unit with three sequential bolts |
| **Rationale** | A single unit matches the tightly coupled user journey, while three bolts keep effort bounded and preserve a clean implementation order: engine, UI, then persistence and verification. |
| **Trade-offs Accepted** | Construction will be mostly sequential rather than parallel. |
| **Decided By** | Team consensus |
| **Compatibility Impact** | N/A |

---

### Decision 004
| Field | Detail |
|-------|--------|
| **Phase/Stage** | Mob Construction — Stage 1 — Domain Modeling |
| **Decision** | Model B-01 around a single `PuzzleState` aggregate root that owns rule enforcement, state transitions, and explanation generation, with no explicit domain events in this bolt. |
| **Context** | The construction session needed a minimal but testable domain boundary for the puzzle engine. |
| **Options Considered** | One aggregate root; aggregate plus separate rules service; finer-grained collaborating entities; explicit domain events |
| **Rationale** | One aggregate matches the fixed, small puzzle state and keeps invariants and explanations consistent while minimizing ceremony for a lightweight bolt. |
| **Trade-offs Accepted** | The domain model is intentionally centralized for now, which may need refactoring only if later bolts introduce substantially more behavior. |
| **Decided By** | Team consensus |
| **Compatibility Impact** | N/A |

---

### Decision 005
| Field | Detail |
|-------|--------|
| **Phase/Stage** | Mob Construction — Stage 3 — Logical Design |
| **Decision** | Change the initial implementation direction for B-01 from a framework-agnostic domain module to a React-oriented implementation tied directly to component state. Superseded by Decision 006 after the testing-by-design review. |
| **Context** | Stage 3 packaging choices were presented for the puzzle engine implementation, and the user selected the React-oriented option after a contradiction check. |
| **Options Considered** | Framework-agnostic TypeScript module; React-oriented implementation; mixed module; hybrid adapter approach |
| **Rationale** | The team prefers to optimize for direct React integration in the first implementation of the puzzle engine. |
| **Trade-offs Accepted** | This reduces separation between domain logic and UI concerns and increases the risk of failing the testing-by-design constraint unless the design is adjusted. The team later rejected this trade-off and adopted the hybrid adapter design in Decision 006. |
| **Decided By** | Team consensus |
| **Compatibility Impact** | N/A |

---

### Decision 006
| Field | Detail |
|-------|--------|
| **Phase/Stage** | Mob Construction — Stage 3 — Logical Design |
| **Decision** | Use a hybrid design for B-01: keep puzzle rules framework-agnostic and add a thin React-facing adapter layer for later UI consumption. |
| **Context** | The initial React-tied preference created a blocking `TEST-01` finding because it would have coupled domain logic directly to UI state. |
| **Options Considered** | Revert to fully framework-agnostic engine; hybrid adapter approach; disable testing enforcement |
| **Rationale** | The hybrid option preserves testability while still aligning with the team's preference for React-oriented integration in later implementation work. |
| **Trade-offs Accepted** | There will be one extra adapter boundary to maintain, but it prevents UI dependencies from leaking into core puzzle logic. |
| **Decided By** | Team consensus |
| **Compatibility Impact** | N/A |

---

### Decision 007
| Field | Detail |
|-------|--------|
| **Phase/Stage** | Mob Construction — Stage 3 — Logical Design |
| **Decision** | Target the implementation scaffold as React + TypeScript + Vite, assume Azure Static Web Apps Free tier initially, and plan only a basic SPA fallback configuration for this bolt. |
| **Context** | Stage 3 required concrete tooling and deployment assumptions before code generation could be designed. |
| **Options Considered** | React + TypeScript + Vite; React + JavaScript + Vite; alternate build tooling; Free tier; Standard tier; upgrade-safe Free-first; basic fallback only; fallback plus security headers |
| **Rationale** | This combination matches the lightweight project scope, keeps deployment simple, and aligns with current static-hosting guidance for Vite output and SPA routing. |
| **Trade-offs Accepted** | Security headers and richer hosting configuration are deferred to later work; Free-tier assumptions may need review before production hardening. |
| **Decided By** | Team consensus |
| **Compatibility Impact** | N/A |

---

### Decision 008
| Field | Detail |
|-------|--------|
| **Phase/Stage** | Mob Construction — Stage 1 — Domain Modeling |
| **Decision** | For B-02, reuse the existing `PuzzleState` aggregate as the sole domain source of truth, add a dedicated `PuzzleViewModel` browser boundary, assign derived browser-play state ownership to that layer, and keep interactions synchronous with no explicit event stream. |
| **Context** | B-02 needs to introduce browser gameplay flow without duplicating puzzle rules inside React or inventing a second business aggregate. |
| **Options Considered** | New UI-facing view model layer; direct component use of raw snapshots; new browser interaction aggregate; explicit UI event model |
| **Rationale** | This keeps rule ownership inside the tested B-01 engine while giving the browser flow a stable, testable presentation boundary that React can render without recalculating domain behavior. |
| **Trade-offs Accepted** | The adapter/view-model layer becomes a stronger seam that must be maintained carefully, but it avoids hidden rule logic in components and preserves testability. |
| **Decided By** | Team consensus |
| **Compatibility Impact** | N/A |

---

### Decision 009
| Field | Detail |
|-------|--------|
| **Phase/Stage** | Mob Construction — Stage 3 — Logical Design |
| **Decision** | For B-02, show all move options in the browser, use a light presentational component split under `App`, and keep a thin custom React hook that delegates to the approved `PuzzleViewModel` boundary instead of replacing it. |
| **Context** | Stage 3 needed a concrete UI interaction shape that preserves browser invalid-move explanations while remaining compliant with the Stage 1 boundary and testing constraints. |
| **Options Considered** | Always-visible move controls; disabled invalid controls; legal-only controls; direct React hook ownership; thin hook delegating to view-model boundary; no hook |
| **Rationale** | This design preserves `US-02 AC-1` in-browser, keeps rule and derivation ownership outside components, and gives the React layer a small ergonomic wrapper without collapsing the approved seam. |
| **Trade-offs Accepted** | Users can attempt moves that will be rejected, and the UI gains one more orchestration layer, but those costs are acceptable to preserve story coverage and testability. |
| **Decided By** | Team consensus |
| **Compatibility Impact** | N/A |

---

### Decision 010
| Field | Detail |
|-------|--------|
| **Phase/Stage** | Mob Construction — Stage 1 — Domain Modeling |
| **Decision** | For B-03, keep local persistence in a dedicated browser-storage adapter, model the full solution path through a dedicated helper/service, and restore persisted `PuzzleStateSnapshot` data before rebuilding the browser-facing view model. |
| **Context** | B-03 needs to add local storage and explicit solution display without collapsing the tested puzzle engine or browser-flow boundaries established in B-01 and B-02. |
| **Options Considered** | Dedicated storage adapter; persistence inside the React hook; persistence in presentational components; dedicated solution helper; hardcoded UI text; solution logic inside the aggregate; restore persisted snapshots; restore from rendered strings; replay from only the last move |
| **Rationale** | This preserves the existing engine and UI seams, keeps browser APIs outside the domain layer, and uses stable snapshot data as the only persisted source of truth. |
| **Trade-offs Accepted** | B-03 introduces additional adapter/service surfaces to maintain, but those seams reduce coupling and make persistence and solution behavior directly testable. |
| **Decided By** | Team consensus |
| **Compatibility Impact** | N/A |

---

### Decision 011
| Field | Detail |
|-------|--------|
| **Phase/Stage** | Mob Construction — Stage 3 — Logical Design |
| **Decision** | For B-03, trigger persistence saves from the React hook through the dedicated storage adapter, restore saved progress automatically on initial load, and reveal the full solution only through an explicit user action in a separate UI section. |
| **Context** | Stage 3 needed a concrete interaction design for persistence and solution presentation that preserves the existing hook, adapter, and component boundaries established in B-02. |
| **Options Considered** | Hook-triggered saves through the adapter; direct component saves; engine-owned persistence; explicit solution action; inline next-move hints; replace controls with the solution; automatic restore on load; restore button; deferred restore |
| **Rationale** | This design matches the approved user stories, keeps browser APIs isolated, and prevents solution hints from leaking into normal gameplay. |
| **Trade-offs Accepted** | The hook takes on more orchestration responsibility, but persistence and solution generation remain outside React-specific business logic. |
| **Decided By** | Team consensus |
| **Compatibility Impact** | N/A |

---

*Copy the Decision block above for additional entries.*

---

## Notes

- Log decisions as they happen during the session — don't try to reconstruct after.
- Not every micro-decision needs logging. Focus on: Unit splits, architecture choices, NFR thresholds, risk acceptance, scope changes.
- For Brownfield sessions, the "Compatibility Impact" field traces decisions back to the compatibility impact map.
- For Construction-phase architecture decisions, use this log AND create formal ADRs in mob-construction/[bolt]/logical_design.md.
- This log provides the traceability the AI-DLC methodology requires — from Intent to decision to artifact.

## Decision Registry

- D1: The first release implements only the classic wolf, goat, and cabbage puzzle variant.
- D2: The application is a static web app deployed to Azure Static Web Apps, with no backend services and no third-party integrations.
- D3: The user model is a single anonymous browser user with local browser persistence for current puzzle state and move history only.
- D4: Invalid moves are blocked with an explanation, losing states are allowed and then explained, and normal play does not provide next-move hints; the user may request a full valid solution path.
- D5: The elaboration structure is one unit, U-01 Puzzle Experience, containing US-01 through US-03.
- D6: Construction proceeds in three sequential bolts: B-01 puzzle engine, B-02 browser UI flow, B-03 persistence, solution display, and final verification.
- D7: Puzzle rules, explanation logic, UI rendering, and local storage must remain separated enough to support unit, integration, and end-to-end testing.
- D8: B-01 uses a single `PuzzleState` aggregate root with embedded rule and explanation logic, and does not define explicit domain events.
- D9: The preferred Stage 3 direction was changed to a React-oriented implementation tied directly to component state, but this was superseded by the approved hybrid adapter design in D10.
- D10: The approved Stage 3 direction for B-01 is a hybrid design: pure puzzle logic plus a thin React-facing adapter layer.
- D11: The code-generation target is React + TypeScript + Vite with `dist` build output and initial Azure Static Web Apps Free-tier assumptions.
- D12: B-01 requires no network API contract and plans only a basic SPA fallback configuration for Static Web Apps.
- D13: B-02 reuses `PuzzleState` as the only aggregate root, introduces a dedicated `PuzzleViewModel` browser boundary, and keeps browser interactions synchronous with derived UI state owned outside React components.
- D14: B-02 keeps all move options visible in the UI, uses a light presentational component split under `App`, and uses only a thin React hook that delegates to the `PuzzleViewModel` boundary.
- D15: B-03 persists stable `PuzzleStateSnapshot` data through a dedicated browser-storage adapter, restores that data before rebuilding the browser view model, and exposes a full solution path only through a dedicated helper/service.
- D16: B-03 saves progress through the hook via the storage adapter, restores automatically on initial load, and reveals the full solution only through an explicit separate UI action.
