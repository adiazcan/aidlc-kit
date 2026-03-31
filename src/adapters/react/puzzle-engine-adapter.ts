import {
  attemptMove,
  createInitialState,
  getAvailableMoves,
} from '../../domain/puzzle/puzzle-state'
import type { PuzzleStateSnapshot } from '../../domain/puzzle/evaluation-result'
import type { MovePassenger } from '../../domain/puzzle/move'

export interface PuzzleViewModel {
  state: PuzzleStateSnapshot
  statusLabel: string
  message: string
  boatSide: string
  leftBank: string[]
  rightBank: string[]
  moveHistory: string[]
  availableMoves: MovePassenger[]
}

export function createInitialPuzzleViewModel(): PuzzleViewModel {
  const state = createInitialState()
  return createPuzzleViewModel(state)
}

export function createPuzzleViewModel(
  state: PuzzleStateSnapshot,
  message: string = state.statusExplanation,
): PuzzleViewModel {
  return toViewModel(state, message)
}

export function applyPuzzleMove(
  state: PuzzleStateSnapshot,
  passenger: MovePassenger,
): PuzzleViewModel {
  const result = attemptMove(state, passenger)
  return toViewModel(result.state, result.message)
}

function toViewModel(state: PuzzleStateSnapshot, message: string): PuzzleViewModel {
  return {
    state,
    statusLabel: state.status.replace('_', ' '),
    message,
    boatSide: capitalize(state.boatSide),
    leftBank: [...state.leftBank],
    rightBank: [...state.rightBank],
    moveHistory: state.moveHistory.map((move) => formatMove(move.passenger, move.fromSide, move.toSide)),
    availableMoves: getAvailableMoves(state).map((move) => move.passenger),
  }
}

function formatMove(passenger: MovePassenger, fromSide: string, toSide: string) {
  if (passenger === 'none') {
    return `Farmer crossed alone from ${fromSide} to ${toSide}`
  }

  return `Farmer crossed with ${passenger} from ${fromSide} to ${toSide}`
}

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1)
}