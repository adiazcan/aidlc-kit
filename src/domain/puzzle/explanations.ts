import type { MovePassenger } from './move'

function passengerLabel(passenger: MovePassenger) {
  return passenger === 'none' ? 'the farmer alone' : `the farmer with the ${passenger}`
}

export function describeInitialState() {
  return 'All puzzle items start on the left bank. Choose a crossing to begin.'
}

export function describeInvalidMove(passenger: MovePassenger) {
  if (passenger === 'none') {
    return 'The farmer can cross alone, so this move should not be rejected.'
  }

  return `That move is invalid because the ${passenger} is not on the same bank as the farmer.`
}

export function describeMoveApplied(passenger: MovePassenger) {
  return `Move applied: ${passengerLabel(passenger)} crosses the river.`
}

export function describeFailureState() {
  return 'That move causes a failure state because the wolf is left with the goat or the goat is left with the cabbage without the farmer present.'
}

export function describeSolvedState() {
  return 'Solved: all puzzle items reached the right bank safely.'
}