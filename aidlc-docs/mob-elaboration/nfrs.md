# Non-Functional Requirements

## NFR-01: Responsive Static Delivery
- The application must load and run as a static web application in modern desktop and mobile browsers.
- The first usable screen should appear quickly on a typical broadband connection without requiring backend calls.
- Related Stories: US-01, US-03

## NFR-02: Clear State Feedback
- The application must clearly distinguish valid moves, invalid moves, losing states, and solved states.
- Explanations must be readable and understandable without requiring prior puzzle expertise.
- Related Stories: US-01, US-02

## NFR-03: Local Persistence Reliability
- The application must persist puzzle state and move history in browser storage after each state change.
- On reload in the same browser, saved state must be restored when available.
- Related Stories: US-03

## NFR-04: Accessibility Baseline
- Core gameplay and solution viewing must remain usable on common screen sizes.
- Interactive controls and status messages should support keyboard use and readable visual contrast.
- Related Stories: US-01, US-02

## NFR-05: Test and Regression Safety
- Puzzle rules, explanation logic, and persistence behavior must be designed for automated testing.
- Acceptance criteria for each approved story must be covered by tests during construction.
- Changes to puzzle rules or persistence behavior must include regression coverage.
- Related Stories: US-01, US-02, US-03