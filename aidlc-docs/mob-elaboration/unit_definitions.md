# Unit Definitions

## U-01: Puzzle Experience

**Purpose**
Deliver the full first-release browser experience for the classic wolf, goat, and cabbage puzzle, including interactive play, move validation, losing-state explanation, solution display, and local progress restoration.

**Stories Assigned**
- US-01: Play the Puzzle in the Browser
- US-02: Understand Invalid and Losing Moves
- US-03: Resume Local Progress

**Why These Stories Belong Together**
- The three stories operate on the same shared puzzle state and user journey.
- Splitting them into multiple units would add coordination overhead without reducing coupling for a lightweight scope.
- A single unit still supports clean internal separation between puzzle rules, UI rendering, and local storage behavior.

**Internal Design Boundary Expectations**
- Puzzle rules and state transitions should remain isolated from framework and storage code.
- UI components should consume puzzle state and explanation outputs without embedding rule logic.
- Local persistence should be handled through a dedicated adapter so it can be tested independently from puzzle rules.

**Testing Notes**
- Unit tests should target puzzle state transitions, rule enforcement, and explanation generation.
- Integration tests should cover local persistence and state restoration.
- End-to-end tests should cover the core solve flow and a representative losing-state scenario.