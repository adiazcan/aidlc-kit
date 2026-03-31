# Logical Design — Bolt 1

## Scope

This logical design covers `B-01` for `U-01 Puzzle Experience`.

Included in this bolt:
- framework-agnostic puzzle engine implementation for `US-01` and `US-02`
- structured result objects for move evaluation
- a thin React-facing adapter boundary for later UI integration
- core automated tests for puzzle rules and explanation behavior

Excluded from this bolt:
- local persistence and restore behavior
- full UI rendering and interaction components
- solution-path presentation in the browser
- any network API or backend service

## Approved Technical Direction

- Frontend stack target for later code generation: `React + TypeScript + Vite`
- Deployment target: `Azure Static Web Apps`, initially assuming the `Free` tier
- Static Web Apps configuration level for this bolt: basic SPA routing fallback only
- API contract: not required for this bolt because it exposes no network API

## Architecture Overview

The implementation will keep puzzle rules framework-agnostic while allowing later React integration through a narrow adapter.

### Layer 1: Domain Engine

Pure TypeScript modules implement:
- `PuzzleState`
- move evaluation
- failure detection
- solved-state detection
- explanation generation

This layer has no React imports, browser APIs, or storage dependencies.

### Layer 2: React-Facing Adapter

A thin adapter translates domain results into shapes convenient for React UI state.

Responsibilities:
- call domain-engine functions
- convert domain result objects into UI-friendly view models if needed
- preserve the structured result contract without rewriting puzzle rules

Constraints:
- no rule ownership in the adapter
- no direct mutation of domain invariants from React components

### Layer 3: UI Consumption Later

Later bolts may consume the adapter through React state management, but this bolt does not implement full UI components.

## Proposed Project Structure

For later code generation, the app should be scaffolded with a Vite React TypeScript layout and a `dist` production output.

```text
src/
  domain/
    puzzle/
      puzzle-state.ts
      move.ts
      puzzle-item.ts
      evaluation-result.ts
      rules.ts
      explanations.ts
  adapters/
    react/
      puzzle-engine-adapter.ts
  tests/
    domain/
      puzzle-state.test.ts
      rules.test.ts
      explanations.test.ts
```

## Module Responsibilities

### `src/domain/puzzle/puzzle-state.ts`
- define the `PuzzleState` aggregate shape
- expose state-creation and move-attempt behavior
- coordinate rule checks and result creation

### `src/domain/puzzle/move.ts`
- define the move value object and passenger type

### `src/domain/puzzle/puzzle-item.ts`
- define the finite item set for farmer, wolf, goat, and cabbage

### `src/domain/puzzle/evaluation-result.ts`
- define the structured result object returned after move evaluation

### `src/domain/puzzle/rules.ts`
- implement legal-move checks, failure detection, and solved-state checks
- remain free of presentation concerns beyond rule outcomes

### `src/domain/puzzle/explanations.ts`
- generate deterministic explanation text from rule outcomes
- keep message generation testable outside React

### `src/adapters/react/puzzle-engine-adapter.ts`
- expose helper functions that React code can call safely
- return structured result objects or simplified view models derived from them
- avoid embedding component-state assumptions into the domain engine

## Public Engine Interface

The domain engine should expose a small public interface:

- `createInitialState(): PuzzleState`
- `getAvailableMoves(state: PuzzleState): Move[]`
- `attemptMove(state: PuzzleState, passenger: MovePassenger): EvaluationResult`

The adapter may expose:

- `createInitialPuzzleViewModel()`
- `applyPuzzleMove(currentState, passenger)`

The adapter remains a convenience layer, not the source of domain truth.

## Result Shape

Structured results are required so later React code can consume them without inspecting hidden internals.

Suggested fields:
- `resultType`: `invalid_move`, `move_applied`, `failure_state`, `solved_state`
- `state`: next `PuzzleState`
- `message`: explanation text
- `availableMoves`: optional recalculated move list for later UI use

## Story Coverage Check

Every story assigned to `B-01` has domain support:
- `US-01`: covered by `PuzzleState`, `Move`, `rules`, and structured engine results
- `US-02`: covered by invalid-move detection, failure detection, and explanation generation

No story assigned to this bolt lacks domain coverage.

## NFR Alignment

### NFR-01 Responsive Static Delivery
- Vite build output will target `dist`, matching the common static-app deployment shape for Azure Static Web Apps.
- The engine remains local and synchronous with no backend round-trips.

### NFR-02 Clear State Feedback
- Explanation generation is explicit and deterministic.
- Result objects always include status and message fields.

### NFR-04 Accessibility Baseline
- This bolt does not implement UI, but the adapter preserves structured state needed for accessible status presentation later.

### NFR-05 Test and Regression Safety
- Core rules and explanations remain outside React and browser APIs.
- The module split supports direct unit testing.

## Azure Static Web Apps Design Notes

Based on current Azure guidance for static web apps:
- keep the frontend as a static-only application
- use the Vite production output directory `dist`
- plan for a basic `staticwebapp.config.json` with SPA navigation fallback in later UI/deployment work
- no API location is needed for this bolt because no backend exists

## Static Web Apps Configuration Assumption

Later deployment work should include a minimal SPA fallback configuration equivalent to:

```json
{
  "navigationFallback": {
    "rewrite": "/index.html",
    "exclude": ["/*.{png,jpg,gif,css,js,ico,svg,woff,woff2}"]
  }
}
```

This is a deployment concern for later bolts, not an implementation requirement for `B-01` code generation.

## Test Strategy for This Bolt

### Unit Tests
- initial state creation
- valid move generation
- invalid move rejection
- failure-state detection
- solved-state detection
- explanation message generation

### Integration Tests
- N/A for this bolt because there are no external or browser storage dependencies yet

### End-to-End Tests
- N/A for this bolt because no UI flow is implemented yet

## ADR Summary

### ADR-01: Use React + TypeScript + Vite for the frontend scaffold
- Pros: strong TypeScript support, straightforward static build to `dist`, good fit for Azure Static Web Apps
- Cons: requires a build tool setup even for a small app

### ADR-02: Keep the puzzle engine framework-agnostic and add a thin React adapter
- Pros: preserves testability and keeps React integration simple
- Cons: introduces one extra abstraction layer

### ADR-03: No API contract for B-01
- Pros: avoids unnecessary contract work for an internal-only engine bolt
- Cons: later UI-facing interfaces rely on TypeScript types instead of a standalone contract document

### ADR-04: Assume Azure Static Web Apps Free tier initially
- Pros: fits a lightweight, static-only first release
- Cons: later production hardening may require revisiting SKU assumptions