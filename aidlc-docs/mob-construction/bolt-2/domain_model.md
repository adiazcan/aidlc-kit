# Domain Model — Bolt 2

## Scope

This domain model covers `B-02` for `U-01 Puzzle Experience` and supports the browser interaction flow for:
- `US-01` Play the Puzzle in the Browser
- `US-02` Understand Invalid and Losing Moves

This bolt adds the browser-facing interaction model on top of the completed `B-01` puzzle engine. It does not change core puzzle rules, local persistence, or solution-path storage.

## Modeling Decisions

- Reuse the `PuzzleState` aggregate from `B-01` as the domain source of truth
- Add a dedicated UI-facing view model layer that derives browser-play state from the engine result
- Keep browser interactions synchronous and local to React state with no explicit event model in this bolt
- Keep ownership of derived browser-play state in the view model layer, while React components remain render-and-dispatch only

## Aggregate Reuse

### PuzzleState

`PuzzleState` remains the only domain aggregate root.

It continues to own:
- legal move evaluation
- invalid-move rejection
- failure-state detection
- solved-state detection
- move history updates
- explanation generation

`B-02` does not introduce a second aggregate because browser interaction state is derived from the existing puzzle state rather than representing a new business boundary.

## New Browser-Facing Model

### PuzzleViewModel

**Purpose**
Represent the browser-ready gameplay state consumed by React components.

**State**
- `state`: underlying `PuzzleStateSnapshot`
- `statusLabel`: UI-ready status text
- `message`: current explanation or status message
- `boatSide`: UI-facing bank label for the boat position
- `leftBank`: display-ready list of left-bank items
- `rightBank`: display-ready list of right-bank items
- `moveHistory`: display-ready list of successful moves
- `availableMoves`: move actions allowed from the current state

**Behavior**
- derive presentation-ready values from domain snapshots
- preserve the engine result as the source record for future persistence and verification work
- expose the minimum state needed for interaction controls, status feedback, and history rendering

## Interaction Boundary

### React Component Role

React components in `B-02` should:
- request the initial `PuzzleViewModel`
- dispatch move requests through the adapter/view-model layer
- render current banks, move controls, status, and move history

React components in `B-02` should not:
- compute legal moves directly from raw snapshots
- rewrite domain explanations
- own puzzle-rule logic

## Invariants for B-02

- The browser interaction flow must not bypass the `PuzzleState` engine
- All enabled move controls must derive from engine-approved available moves
- Invalid move explanations and failure explanations must remain engine-derived
- The UI-facing view model may transform values for presentation, but must not mutate rule outcomes
- Browser interaction remains synchronous in this bolt; no queued commands, async workflows, or event streams are introduced

## Boundary Rationale

- Reusing the single `PuzzleState` aggregate preserves `TEST-01` by avoiding rule duplication inside React
- A dedicated `PuzzleViewModel` layer keeps derived browser-play state testable outside the component tree
- Keeping React render-only prevents hidden dependencies and preserves a clear seam for later persistence integration in `B-03`

## Testing Implications

### Unit Tests
- adapter/view-model creation from the initial engine state
- browser-ready derivation of enabled moves and status text
- browser interaction updates after valid, invalid, failed, and solved moves

### Integration Tests
- React UI interaction tests for button availability, status rendering, bank rendering, and move history updates

### End-to-End Tests
- minimal critical browser flow only, if needed later in this bolt after the UI exists

## Coverage Mapping

- `US-01 AC-1`: initial view model renders the initial puzzle state
- `US-01 AC-2`: enabled controls derive from legal moves only
- `US-01 AC-3`: successful move interaction updates rendered state and history immediately
- `US-01 AC-4`: solved interaction state is clearly surfaced in the browser view
- `US-02 AC-1`: invalid move attempts remain blocked and show explanation text through the browser flow
- `US-02 AC-2`: failure outcomes remain visible and explained through the browser flow

## Out of Scope for Bolt 2

- browser persistence and restoration
- explicit solution-path request and display flow
- backend APIs, remote state, or analytics