# Risk Register

## R-01: Puzzle Rule Logic Becomes Entangled with UI
- Risk: Rule validation and explanation logic may be embedded in UI code, making behavior hard to test and maintain.
- Impact: Medium
- Mitigation: Keep puzzle state transitions and explanation generation in isolated domain logic with clear inputs and outputs.
- Related Stories: US-01, US-02

## R-02: Losing-State and Invalid-Move Messaging Is Ambiguous
- Risk: Users may not understand why a move failed or caused a losing state if explanations are too generic.
- Impact: Medium
- Mitigation: Use explicit rule-based explanations tied to the wolf, goat, and cabbage constraints and verify them with acceptance tests.
- Related Stories: US-02

## R-03: Local Progress Restoration Is Inconsistent
- Risk: Saved state or move history may not restore correctly after reload, causing confusion or lost progress.
- Impact: Medium
- Mitigation: Centralize persistence behavior behind one storage adapter and cover save/restore behavior with integration tests.
- Related Stories: US-03

## R-04: Accessibility and Small-Screen Usability Are Deferred
- Risk: A visually simple puzzle layout may still become hard to use on mobile or keyboard-only flows if not planned early.
- Impact: Medium
- Mitigation: Keep the interface responsive from the start and include keyboard-accessible controls and readable status messaging in acceptance validation.
- Related Stories: US-01, US-02

## R-05: Test Coverage Drifts from Acceptance Criteria
- Risk: Construction may implement the puzzle but miss explicit tests for all accepted behaviors.
- Impact: High
- Mitigation: Preserve the story-to-test-case mapping and require tests for each acceptance criterion before marking bolts complete.
- Related Stories: US-01, US-02, US-03