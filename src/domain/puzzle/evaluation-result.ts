import type { Move } from './move'
import type { PuzzleItem } from './puzzle-item'

export type PuzzleStatus = 'in_progress' | 'failed' | 'solved'

export type EvaluationResultType =
  | 'invalid_move'
  | 'move_applied'
  | 'failure_state'
  | 'solved_state'

export interface PuzzleStateSnapshot {
  leftBank: PuzzleItem[]
  rightBank: PuzzleItem[]
  boatSide: 'left' | 'right'
  moveHistory: Move[]
  status: PuzzleStatus
  statusExplanation: string
}

export interface EvaluationResult {
  resultType: EvaluationResultType
  state: PuzzleStateSnapshot
  message: string
  availableMoves: Move[]
}