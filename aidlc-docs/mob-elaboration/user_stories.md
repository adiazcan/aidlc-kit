# User Stories

## Story List

### US-01: Play the Puzzle in the Browser
As an anonymous browser user,
I want to move the farmer, wolf, goat, and cabbage between river banks,
so that I can try to solve the puzzle interactively.

**Acceptance Criteria**
- AC-1: The application displays the initial puzzle state with all puzzle elements on the starting bank.
- AC-2: The user can perform only legal transport actions based on the boat constraints of the classic wolf, goat, and cabbage puzzle.
- AC-3: After each valid move, the application updates the puzzle state and move history immediately.
- AC-4: The application detects when the puzzle reaches the solved state and clearly communicates success.

**Planned Test Cases**
- TC-US-01-1 validates AC-1
- TC-US-01-2 validates AC-2
- TC-US-01-3 validates AC-3
- TC-US-01-4 validates AC-4

### US-02: Understand Invalid and Losing Moves
As a learner,
I want the application to explain why a move is invalid or why a resulting state fails,
so that I can understand the puzzle rules instead of guessing.

**Acceptance Criteria**
- AC-1: If the user attempts an invalid move, the application prevents the move and explains why it is not allowed.
- AC-2: If the user makes a valid move that results in a losing state, the application shows the failed state and explains why the failure occurred.
- AC-3: The application can present at least one valid complete solution path when the user requests help.
- AC-4: Normal gameplay does not reveal the next recommended move unless the user explicitly requests the full solution view.

**Planned Test Cases**
- TC-US-02-1 validates AC-1
- TC-US-02-2 validates AC-2
- TC-US-02-3 validates AC-3
- TC-US-02-4 validates AC-4

### US-03: Resume Local Progress
As an anonymous browser user,
I want my current puzzle state and move history saved in the browser,
so that I can leave and return without losing progress.

**Acceptance Criteria**
- AC-1: The application saves the current puzzle state locally in the browser after each state change.
- AC-2: The application saves the move history locally in the browser after each move.
- AC-3: When the user reloads or reopens the application in the same browser, the saved state and move history are restored.
- AC-4: If no saved progress exists, the application starts from the initial puzzle state.

**Planned Test Cases**
- TC-US-03-1 validates AC-1
- TC-US-03-2 validates AC-2
- TC-US-03-3 validates AC-3
- TC-US-03-4 validates AC-4