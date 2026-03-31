# Domain Model — Bolt 1

## Scope

This domain model covers `B-01` for `U-01 Puzzle Experience` and supports:
- `US-01` Play the Puzzle in the Browser
- `US-02` Understand Invalid and Losing Moves

This bolt models puzzle rules, state transitions, invalid-move handling, losing-state detection, solved-state detection, and explanation generation. It does not model local persistence or UI rendering.

## Modeling Decisions

- Use one aggregate root: `PuzzleState`
- Keep rule evaluation and explanation generation inside the aggregate
- Omit explicit domain events in this bolt to keep the model synchronous and minimal

## Aggregate Root

### PuzzleState

**Purpose**
Own the full puzzle snapshot and enforce all gameplay invariants for the classic wolf, goat, and cabbage puzzle.

**State**
- `leftBank`: set of puzzle items currently on the left bank
- `rightBank`: set of puzzle items currently on the right bank
- `boatSide`: the bank where the boat and farmer currently are
- `moveHistory`: ordered list of successful moves applied so far
- `status`: one of `in_progress`, `failed`, or `solved`
- `statusExplanation`: human-readable explanation for the latest invalid move, failure, success, or neutral state transition

**Behavior**
- `createInitialState()`: builds the starting arrangement with all items on the origin bank
- `getAvailableMoves()`: returns the legal transport choices from the current state
- `attemptMove(passenger)`: validates the requested move, rejects invalid moves with an explanation, or applies the move and updates status
- `isSolved()`: checks whether all items have reached the destination bank safely
- `isFailed()`: checks whether the wolf is left alone with the goat or the goat is left alone with the cabbage on either bank without the farmer present
- `describeInvalidMove(passenger)`: explains why a requested move is not allowed
- `describeFailureState()`: explains why the resulting state failed

## Value Objects

### PuzzleItem

Represents one of the fixed domain items:
- `farmer`
- `wolf`
- `goat`
- `cabbage`

This value object is finite and enumerable.

### Move

Represents one attempted crossing.

**Fields**
- `fromSide`
- `toSide`
- `passenger`: `none`, `wolf`, `goat`, or `cabbage`

**Notes**
- The farmer is implicit in every move and is not optional.
- `none` represents the farmer crossing alone.

### EvaluationResult

Represents the outcome of `attemptMove(passenger)`.

**Fields**
- `resultType`: `invalid_move`, `move_applied`, `failure_state`, or `solved_state`
- `nextState`: resulting `PuzzleState` snapshot when a move is applied
- `message`: explanation suitable for later UI display

## Invariants Owned by PuzzleState

- The farmer must always travel with the boat.
- At most one passenger may travel with the farmer in a single move.
- A passenger can only be moved if it starts on the same bank as the farmer.
- A move that violates boat or location rules is rejected as an invalid move.
- A move can be valid to execute and still produce a failed state afterward.
- A failed state occurs when the farmer is absent and either:
  - the wolf and goat are left together on the same bank, or
  - the goat and cabbage are left together on the same bank.
- A solved state occurs when all puzzle items have been moved to the destination bank without entering a failed state.

## Aggregate Boundary Rationale

- All rule decisions depend on one shared puzzle snapshot.
- Splitting rules into a separate service now would add indirection without reducing complexity for this bolt.
- Keeping explanations inside the aggregate ensures rule evaluation and user-facing reasoning stay consistent.

## Testing Implications

### Unit Tests
- Initial state creation
- Available move generation from representative states
- Invalid move rejection for passenger location and boat-rule violations
- Valid move application and state updates
- Failure-state detection after a valid move
- Solved-state detection
- Explanation text selection for invalid and failed outcomes

### Integration Tests
- N/A in this bolt for persistence or external dependencies

### End-to-End Tests
- N/A in this bolt because UI flow is introduced in later bolts

## Coverage Mapping

- `US-01 AC-1`: `createInitialState()`
- `US-01 AC-2`: `getAvailableMoves()` and `attemptMove(passenger)`
- `US-01 AC-3`: state mutation and move history updates on successful moves
- `US-01 AC-4`: `isSolved()` and solved-state result handling
- `US-02 AC-1`: invalid-move rejection and explanation generation
- `US-02 AC-2`: failure-state detection and explanation generation

## Out of Scope for Bolt 1

- Browser storage and restore behavior
- Rendering decisions and interaction controls
- Solution-path presentation in the UI