# Logical Design — Bolt 3

## Scope

This logical design covers `B-03` for `U-01 Puzzle Experience`.

Included in this bolt:
- browser-local persistence for puzzle state and move history
- restore-on-load behavior for previously saved progress
- an explicit user-triggered full solution view
- preservation of normal gameplay without next-move hint leakage
- remaining verification for `US-01`, `US-02`, and `US-03`

Excluded from this bolt:
- backend or cloud-synced persistence
- authenticated user profiles
- incremental hinting or next-move coaching during normal play
- multiple alternate solution strategies
- network APIs or deployment automation

## Approved Technical Direction

- Keep the existing React + TypeScript + Vite stack
- Keep browser storage behind a dedicated adapter that is the only layer touching `localStorage`
- Extend the thin React hook so it coordinates restore-on-load and save-after-change through the storage adapter
- Add an explicit `Show solution` action that reveals the full valid solution path in a separate UI section
- Restore persisted `PuzzleStateSnapshot` data on initial load, and fall back to the initial puzzle state when nothing is saved
- No API contract is required because `B-03` exposes no network boundary

## Architecture Overview

### Layer 1: Domain Engine

The existing `PuzzleState` engine remains unchanged and continues to own:
- rule enforcement
- invalid-move rejection
- failure-state detection
- solved-state detection
- move history updates
- explanation generation

### Layer 2: Browser View-Model Service

The React adapter remains the browser-facing derivation layer.

Responsibilities:
- rebuild a `PuzzleViewModel` from restored snapshot data
- continue deriving browser-ready labels, banks, move history, and available moves
- preserve the engine as the source of truth for all gameplay outcomes

Constraints:
- no direct storage access in the adapter
- no solution-view ownership beyond formatting display-ready values if needed

### Layer 3: Storage Adapter

A dedicated browser-storage adapter will encapsulate `localStorage` interaction.

Responsibilities:
- save the latest stable puzzle snapshot after state changes
- load saved progress on app startup
- return `null` or equivalent when no saved progress exists
- optionally clear saved progress when a reset flow is added later

Constraints:
- no puzzle-rule ownership
- no React dependency
- only stable snapshot data is serialized

### Layer 4: Solution Helper / Service

A dedicated helper exposes one full valid solve sequence.

Responsibilities:
- return the deterministic full move sequence for the classic puzzle
- optionally expose display-ready move labels for the UI

Constraints:
- does not mutate live gameplay state
- remains hidden during normal play until the user explicitly requests the solution

### Layer 5: Thin React Hook

The hook grows into the coordinator for restore/save behavior.

Responsibilities:
- initialize gameplay state from storage when available
- fall back to the initial state when no saved snapshot exists
- save updated progress after state changes
- expose a boolean or equivalent state for whether the full solution is visible
- expose UI actions such as `applyMove` and `showSolution`

Constraints:
- delegates storage to the adapter and view derivation to the adapter/view-model service
- does not own persistence serialization rules or solution-generation logic

### Layer 6: Presentational Components

The current presentational component split remains, with one additional solution-view surface.

Components should render:
- gameplay status and explanation
- banks and move controls
- successful move history
- full solution path only after explicit user action

## Proposed Module Structure

```text
src/
  App.tsx
  hooks/
    use-puzzle-game.ts
  adapters/
    react/
      puzzle-engine-adapter.ts
    browser/
      puzzle-storage.ts
  services/
    puzzle-solution.ts
  components/
    puzzle-status.tsx
    puzzle-bank.tsx
    puzzle-controls.tsx
    puzzle-history.tsx
    puzzle-solution.tsx
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
- compose the persistence-aware gameplay page
- include the explicit solution action and the conditional solution section
- preserve accessible page structure

### `src/hooks/use-puzzle-game.ts`
- restore saved progress on initial load
- save progress after state changes
- expose solution-view state and action handlers
- keep orchestration out of presentational components

### `src/adapters/browser/puzzle-storage.ts`
- encapsulate `localStorage` reads/writes
- serialize and deserialize stable snapshot shapes

### `src/services/puzzle-solution.ts`
- expose the complete valid solution path for the classic puzzle
- optionally expose display-friendly labels derived from the move list

### `src/components/puzzle-solution.tsx`
- render the complete solution sequence only when requested
- remain presentational only

Existing components continue their current render-only responsibilities.

## Browser Interaction Flow

1. `App` calls `usePuzzleGame()`.
2. The hook attempts to load saved progress through the storage adapter.
3. If saved progress exists, the hook rebuilds the browser-facing view model from that restored snapshot.
4. If no saved progress exists, the hook falls back to `createInitialPuzzleViewModel()`.
5. On each move, the hook delegates to `applyPuzzleMove(...)`, updates local React state, and persists the resulting stable snapshot through the storage adapter.
6. If the user selects `Show solution`, the hook asks the solution helper for the full path and reveals it in a separate solution section.

This flow preserves `US-02 AC-4` because the solution remains hidden unless explicitly requested.

## Story Coverage Check

Every story assigned to `B-03` has technical coverage:
- `US-03`: covered by the storage adapter, restore-on-load hook flow, and persistence-aware UI initialization
- `US-02 AC-3` and `AC-4`: covered by the dedicated solution helper and explicit solution-view UI
- remaining verification for `US-01` and `US-02`: covered by the final integration and persistence regression tests

No story assigned to this bolt lacks design coverage.

## NFR Alignment

### NFR-01 Responsive Static Delivery
- Persistence and solution logic remain fully client-side with no backend dependency.
- The added adapter/service surfaces remain lightweight and static-host compatible.

### NFR-02 Clear State Feedback
- Existing explanation/status surfaces stay unchanged during normal play.
- Solution display is explicit and separate from status messaging.

### NFR-03 Local Persistence Reliability
- Save-after-change and restore-on-load behavior are explicit responsibilities of the hook plus storage adapter.
- Stable snapshot serialization minimizes restore drift.

### NFR-04 Accessibility Baseline
- The explicit solution action will be keyboard-accessible.
- The added solution section will remain separate and clearly labeled.

### NFR-05 Test and Regression Safety
- Storage and solution logic stay outside the puzzle engine and presentational components.
- The design supports direct unit tests for storage and solution helpers plus integration tests for restore flow.

## API Contract

No API contract is required for `B-03` because the bolt has no HTTP, message, or external service boundary.

## Test Strategy for This Bolt

### Unit Tests
- `TC-US-03-1` and `TC-US-03-2`: storage adapter saves stable snapshot data after state changes
- `TC-US-03-3` and `TC-US-03-4`: restore helper behavior for existing and missing saved progress
- `TC-US-02-3`: solution helper exposes a valid complete solution path
- `TC-US-02-4`: solution-view state remains hidden unless explicitly requested

### Integration Tests
- browser restore-on-load flow using stored snapshot data
- browser fallback-to-initial-state flow with empty storage
- browser solution reveal flow after explicit user action
- regression tests to confirm previously completed `US-01` and `US-02` behaviors still hold after persistence is added

### End-to-End Tests
- N/A for this bolt unless a minimal representative persistence round-trip becomes necessary during implementation

## ADR Summary

### ADR-01: Persist through a dedicated browser adapter
- Pros: isolates `localStorage`, preserves domain purity, and supports direct storage tests
- Cons: adds another adapter surface to maintain

### ADR-02: Restore on initial load automatically
- Pros: matches the approved user story and keeps the browser experience seamless
- Cons: requires careful fallback behavior when no saved progress exists

### ADR-03: Reveal the full solution only through an explicit action
- Pros: satisfies the help requirement without leaking next-step hints during ordinary play
- Cons: adds one more UI state branch to manage and test