import {
  describeFailureState,
  describeInitialState,
  describeInvalidMove,
  describeMoveApplied,
  describeSolvedState,
} from './explanations'
import type { EvaluationResult, PuzzleStateSnapshot } from './evaluation-result'
import type { BankSide, Move, MovePassenger } from './move'
import type { PuzzleItem } from './puzzle-item'
import { createMove, getCandidatePassengers, getOppositeSide, isFailureState, isSolvedState } from './rules'

export class PuzzleState {
  readonly leftBank: ReadonlySet<PuzzleItem>
  readonly rightBank: ReadonlySet<PuzzleItem>
  readonly boatSide: BankSide
  readonly moveHistory: ReadonlyArray<Move>
  readonly status: PuzzleStateSnapshot['status']
  readonly statusExplanation: string

  constructor({
    leftBank,
    rightBank,
    boatSide,
    moveHistory,
    status,
    statusExplanation,
  }: {
    leftBank: Iterable<PuzzleItem>
    rightBank: Iterable<PuzzleItem>
    boatSide: BankSide
    moveHistory: Move[]
    status: PuzzleStateSnapshot['status']
    statusExplanation: string
  }) {
    this.leftBank = new Set(leftBank)
    this.rightBank = new Set(rightBank)
    this.boatSide = boatSide
    this.moveHistory = moveHistory
    this.status = status
    this.statusExplanation = statusExplanation
  }

  static createInitialState() {
    return new PuzzleState({
      leftBank: ['farmer', 'wolf', 'goat', 'cabbage'],
      rightBank: [],
      boatSide: 'left',
      moveHistory: [],
      status: 'in_progress',
      statusExplanation: describeInitialState(),
    })
  }

  toSnapshot(): PuzzleStateSnapshot {
    return {
      leftBank: [...this.leftBank],
      rightBank: [...this.rightBank],
      boatSide: this.boatSide,
      moveHistory: [...this.moveHistory],
      status: this.status,
      statusExplanation: this.statusExplanation,
    }
  }

  getAvailableMoves(): Move[] {
    const currentBank = this.boatSide === 'left' ? this.leftBank : this.rightBank
    return getCandidatePassengers(currentBank).map((passenger) => createMove(this.boatSide, passenger))
  }

  attemptMove(passenger: MovePassenger): EvaluationResult {
    const currentBank = this.boatSide === 'left' ? new Set(this.leftBank) : new Set(this.rightBank)
    const oppositeBank = this.boatSide === 'left' ? new Set(this.rightBank) : new Set(this.leftBank)

    if (passenger !== 'none' && !currentBank.has(passenger)) {
      return this.createResult('invalid_move', this, describeInvalidMove(passenger))
    }

    currentBank.delete('farmer')
    oppositeBank.add('farmer')

    if (passenger !== 'none') {
      currentBank.delete(passenger)
      oppositeBank.add(passenger)
    }

    const nextBoatSide = getOppositeSide(this.boatSide)
    const move = createMove(this.boatSide, passenger)

    const nextState =
      this.boatSide === 'left'
        ? new PuzzleState({
            leftBank: currentBank,
            rightBank: oppositeBank,
            boatSide: nextBoatSide,
            moveHistory: [...this.moveHistory, move],
            status: 'in_progress',
            statusExplanation: describeMoveApplied(passenger),
          })
        : new PuzzleState({
            leftBank: oppositeBank,
            rightBank: currentBank,
            boatSide: nextBoatSide,
            moveHistory: [...this.moveHistory, move],
            status: 'in_progress',
            statusExplanation: describeMoveApplied(passenger),
          })

    if (isFailureState(nextState.leftBank, nextState.rightBank)) {
      const failedState = new PuzzleState({
        ...nextState.toSnapshot(),
        status: 'failed',
        statusExplanation: describeFailureState(),
      })
      return this.createResult('failure_state', failedState, failedState.statusExplanation)
    }

    if (isSolvedState(nextState.rightBank)) {
      const solvedState = new PuzzleState({
        ...nextState.toSnapshot(),
        status: 'solved',
        statusExplanation: describeSolvedState(),
      })
      return this.createResult('solved_state', solvedState, solvedState.statusExplanation)
    }

    return this.createResult('move_applied', nextState, nextState.statusExplanation)
  }

  private createResult(
    resultType: EvaluationResult['resultType'],
    state: PuzzleState,
    message: string,
  ): EvaluationResult {
    return {
      resultType,
      state: state.toSnapshot(),
      message,
      availableMoves: state.getAvailableMoves(),
    }
  }
}

export function createInitialState() {
  return PuzzleState.createInitialState().toSnapshot()
}

export function getAvailableMoves(snapshot: PuzzleStateSnapshot) {
  return fromSnapshot(snapshot).getAvailableMoves()
}

export function attemptMove(snapshot: PuzzleStateSnapshot, passenger: MovePassenger) {
  return fromSnapshot(snapshot).attemptMove(passenger)
}

function fromSnapshot(snapshot: PuzzleStateSnapshot) {
  return new PuzzleState({
    leftBank: snapshot.leftBank,
    rightBank: snapshot.rightBank,
    boatSide: snapshot.boatSide,
    moveHistory: snapshot.moveHistory,
    status: snapshot.status,
    statusExplanation: snapshot.statusExplanation,
  })
}