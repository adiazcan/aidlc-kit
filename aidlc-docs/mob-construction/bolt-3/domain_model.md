# Domain Model — Bolt 3

## Scope

This domain model covers `B-03` for `U-01 Puzzle Experience` and supports:
- `US-03` Resume Local Progress
- `US-02 AC-3` present at least one valid complete solution path on request
- `US-02 AC-4` avoid revealing the next recommended move during normal play
- remaining verification scope for `US-01` and `US-02`

This bolt adds persistence and solution-path modeling around the completed puzzle engine and browser interaction flow. It does not introduce backend services or change the core puzzle rules.

## Modeling Decisions

- Reuse `PuzzleState` and the browser-facing `PuzzleViewModel` from earlier bolts as the existing gameplay source of truth
- Add a dedicated browser-storage adapter for local persistence outside the puzzle engine and outside React components
- Add a dedicated solution helper/service that exposes a deterministic full solution path outside React components
- Restore persisted `PuzzleStateSnapshot` plus move history, then rebuild the browser view model from that restored state

## Aggregate Reuse

### PuzzleState

`PuzzleState` remains the only domain aggregate root.

It continues to own:
- state transitions
- rule enforcement
- invalid and failure outcomes
- solved-state detection
- move history updates

`B-03` does not add a new aggregate because persistence and solution-path behavior are integration concerns around the existing snapshot model, not new business ownership boundaries.

## New Supporting Models

### PersistedPuzzleSnapshot

**Purpose**
Represent the serializable browser-storage record used to save and restore local progress.

**State**
- `state`: persisted `PuzzleStateSnapshot`
- `savedAt`: timestamp or version marker for storage lifecycle checks

**Behavior**
- provide a stable serialized shape for browser storage
- allow the app to distinguish between existing and missing saved progress

### PuzzleSolutionPath

**Purpose**
Represent a deterministic, full valid solve sequence that can be shown only when the user explicitly requests it.

**State**
- ordered list of allowed move passengers
- optional display-ready move labels for UI consumption

**Behavior**
- expose one full valid solution path
- remain separate from normal gameplay state so the next move is not leaked during ordinary play

## Integration Boundaries

### Browser Storage Adapter

Responsibilities:
- save the latest puzzle snapshot after state changes
- load a previously saved snapshot when present
- clear or replace saved progress when necessary

Constraints:
- no puzzle-rule ownership
- no direct rendering responsibility
- serializes only stable snapshot data, not rendered UI strings

### Solution Helper / Service

Responsibilities:
- return one complete valid solution sequence on explicit request
- optionally expose display-ready labels derived from that sequence

Constraints:
- no mutation of live puzzle state when merely viewing the solution
- no incremental hinting during normal gameplay

## Invariants for B-03

- Persisted progress must restore the same underlying puzzle snapshot and move history that was previously saved
- Missing saved progress must fall back to the initial puzzle state
- Viewing the full solution must be explicit and separate from normal move selection
- Normal gameplay surfaces must not reveal the next recommended move unless the user requests the full solution view
- Storage and solution helpers must remain outside `PuzzleState` so the domain engine stays infrastructure-free

## Boundary Rationale

- A dedicated storage adapter satisfies `TEST-01` by isolating browser APIs from domain logic
- Restoring snapshots rather than rendered strings preserves a stable source of truth and reduces reconstruction risk
- A dedicated solution helper keeps the engine focused on state transitions while allowing explicit solution display without leaking hints into ordinary play

## Testing Implications

### Unit Tests
- solution helper returns a valid complete solve sequence
- storage adapter serializes and deserializes the persisted snapshot shape correctly
- restored snapshots rebuild the expected browser-facing view model

### Integration Tests
- browser save-after-move behavior
- restore-on-load behavior when saved progress exists
- initial-state fallback when no saved progress exists
- solution display behavior only after explicit user action

### End-to-End Tests
- representative persistence round-trip for a partially completed puzzle
- representative solution-view request without automatic hinting during normal play

## Coverage Mapping

- `US-03 AC-1`: persistence adapter saves the current puzzle state after each state change
- `US-03 AC-2`: persistence adapter saves move history after each move
- `US-03 AC-3`: app restore flow rebuilds the browser state from saved progress on reload
- `US-03 AC-4`: app starts from the initial puzzle state when no saved progress exists
- `US-02 AC-3`: solution helper exposes at least one complete valid solution path on explicit request
- `US-02 AC-4`: solution state remains hidden during normal gameplay unless that explicit request is made

## Out of Scope for Bolt 3

- cloud-synced persistence
- multiple alternate solution strategies
- progressive hinting or next-move coaching during normal play
- backend APIs or authenticated storage