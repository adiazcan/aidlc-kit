# Logical Design — Bolt 2

## Scope

This logical design covers `B-02` for `U-01 Puzzle Experience`.

Included in this bolt:
- browser gameplay presentation for the existing puzzle engine
- move controls for all supported crossing options
- bank, status, and move-history rendering
- browser-visible invalid, failed, in-progress, and solved feedback
- a thin React hook that delegates to the approved browser-facing view-model boundary
- UI and interaction tests for the critical browser gameplay flow

Excluded from this bolt:
- browser persistence and restoration
- solution-path request and display flow
- backend services or network APIs
- cloud deployment automation or Static Web Apps configuration files

## Approved Technical Direction

- Keep the existing React + TypeScript + Vite stack
- Extend the existing React adapter into a fuller browser-facing view-model service
- Add a thin custom React hook that delegates orchestration to the view-model service rather than owning browser-state derivation itself
- Use a single `App` container with a few small presentational subcomponents for banks, controls, status, and move history
- Show all move options in the UI and let the engine reject invalid attempts with an explanation so `US-02 AC-1` can be exercised in-browser
- No API contract is required because `B-02` exposes no network boundary

## Architecture Overview

### Layer 1: Domain Engine

The completed `B-01` engine remains unchanged and owns:
- rule enforcement
- invalid-move rejection
- failure-state detection
- solved-state detection
- move history updates
- explanation generation

### Layer 2: Browser View-Model Service

The React adapter becomes the main browser-facing service.

Responsibilities:
- derive browser-ready labels and lists from the domain snapshot
- expose helpers for initializing and applying moves
- keep all move options available for UI rendering
- preserve the domain engine as the source of truth for move validity and explanations

Constraints:
- no rule duplication
- no browser storage access in this bolt
- no direct DOM or React dependency in derivation logic

### Layer 3: Thin React Hook

A small custom hook wraps the view-model service.

Responsibilities:
- own local React state for the current `PuzzleViewModel`
- expose stable UI actions such as `applyMove`
- keep React-specific state wiring out of presentational components

Constraints:
- delegates derivation and interaction semantics to the view-model service
- does not recalculate legal moves or rewrite engine messages

### Layer 4: Presentational Components

Small presentational components render:
- current status and explanation
- left and right banks
- move controls
- successful move history

These components receive render-ready props and emit user interactions upward.

## Proposed Module Structure

```text
src/
  App.tsx
  hooks/
    use-puzzle-game.ts
  components/
    puzzle-status.tsx
    puzzle-bank.tsx
    puzzle-controls.tsx
    puzzle-history.tsx
  adapters/
    react/
      puzzle-engine-adapter.ts
  domain/
    puzzle/
      puzzle-state.ts
      move.ts
      puzzle-item.ts
      evaluation-result.ts
      rules.ts
      explanations.ts
```

## Component Responsibilities

### `App.tsx`
- compose the main gameplay page
- connect the hook output to presentational components
- keep page-level structure and accessibility landmarks

### `src/hooks/use-puzzle-game.ts`
- create the initial browser view model
- expose `applyMove(passenger)` for UI actions
- keep local React state synchronized with the adapter/view-model service

### `src/components/puzzle-status.tsx`
- render status and explanation text
- expose an `aria-live` region for gameplay feedback

### `src/components/puzzle-bank.tsx`
- render one bank and its items
- keep rendering presentational only

### `src/components/puzzle-controls.tsx`
- render all move options consistently
- dispatch the selected passenger back to the hook
- optionally reflect which moves are currently legal using existing `availableMoves`

### `src/components/puzzle-history.tsx`
- render successful move history in order
- show an empty-state message when no successful moves exist

## Browser Interaction Flow

1. `App` calls `usePuzzleGame()`.
2. The hook initializes state through `createInitialPuzzleViewModel()`.
3. The controls render all supported move options: `none`, `wolf`, `goat`, and `cabbage`.
4. On click, the hook delegates to `applyPuzzleMove(current.state, passenger)`.
5. The adapter/view-model service returns the next browser-ready state.
6. Presentational components re-render status, banks, and history immediately.

This flow preserves `US-02 AC-1` because invalid move attempts remain possible and engine-explained.

## Story Coverage Check

Every story assigned to `B-02` has technical coverage:
- `US-01`: covered by the hook, browser-facing view-model service, and presentational gameplay components
- `US-02`: covered by always-available move controls plus engine-derived explanation rendering in the status surface

No story assigned to this bolt lacks design coverage.

## NFR Alignment

### NFR-01 Responsive Static Delivery
- The UI remains fully client-side with no network dependency.
- The component split remains lightweight and suitable for a Vite static bundle.

### NFR-02 Clear State Feedback
- Status and explanation rendering are separated into a dedicated status component.
- Invalid, failed, solved, and in-progress outcomes remain visible through engine-derived messaging.

### NFR-04 Accessibility Baseline
- The page keeps semantic sections and keyboard-accessible buttons.
- The status surface uses an `aria-live` region for changing gameplay feedback.

### NFR-05 Test and Regression Safety
- Rule ownership remains outside React.
- The hook and presentational components can be tested independently from the domain engine.

## API Contract

No API contract is required for `B-02` because the bolt has no HTTP, message, or external service boundary.

## Test Strategy for This Bolt

### Unit Tests
- hook initialization delegates correctly to the view-model service
- hook move application updates browser state correctly for valid, invalid, failed, and solved outcomes
- presentational components render the supplied view-model state without side effects

### Integration Tests
- React interaction tests validate `US-01 AC-1` through `AC-4`
- React interaction tests validate `US-02 AC-1` and `AC-2`
- acceptance-traceable tests keep explicit test IDs aligned to story coverage

### End-to-End Tests
- N/A for this bolt unless a minimal critical path becomes necessary during implementation

## ADR Summary

### ADR-01: Show all move options in the browser
- Pros: allows invalid move attempts to be exercised and explained in-browser, matching the approved story scope
- Cons: some users may click options that cannot succeed from the current bank

### ADR-02: Use a thin React hook that delegates to the browser view-model service
- Pros: keeps React ergonomic without moving behavior ownership into React-specific code
- Cons: adds one extra abstraction layer between components and the engine adapter

### ADR-03: Use a light component split under a single `App` container
- Pros: improves readability and testability without over-fragmenting a small UI
- Cons: future growth may require another round of component refactoring