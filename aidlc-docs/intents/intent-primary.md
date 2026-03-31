# Intent: River Crossing Puzzle Web Application

**Type:** feature

## Summary

Build a web application for the classic wolf, goat, and cabbage river crossing puzzle. The application should present the puzzle clearly, allow users to play through moves, explain why invalid or losing moves fail, and preserve local progress so the puzzle is easier to understand and complete.

## Users / Actors

- Anonymous browser users who want to solve the river crossing challenge
- Learners who want to understand why certain moves succeed or fail

## Key Scenarios

1. A user opens the application and sees the river crossing puzzle laid out with the initial state.
2. A user makes moves to transport puzzle elements across the river and the application allows losing states to occur, then explains why the move caused failure.
3. A user attempts an invalid move and receives a clear explanation for why the move is not allowed.
4. A user reopens the application and resumes from locally saved puzzle state and move history.

## Constraints

- Must be delivered as a web application
- Must implement the classic wolf, goat, and cabbage variant only in the first release
- Must run as a static web application with no backend services
- Must be deployable to Azure Static Web Apps
- Must store progress locally in the browser only

## Out of Scope

- Multiplayer or collaborative puzzle solving
- User accounts, authentication, or cloud-synced progress
- Step-by-step next-move hints
- Third-party APIs, backend services, or analytics integrations
- A library of many different puzzle types unless later approved

## Success Criteria

- Users can interact with the puzzle through the browser
- The application clearly explains invalid moves and losing states
- The application preserves current state and move history in local browser storage
- The application can present at least one valid solution path without guiding the next move during normal play
- The application remains simple, responsive, and usable as a static site on desktop and mobile browsers
- The final scope is documented through AI-DLC elaboration artifacts
