import { describe, expect, it } from 'vitest'
import { attemptMove, createInitialState, getAvailableMoves } from './puzzle-state'

describe('PuzzleState engine', () => {
  it('TC-US-01-1 / US-01 AC-1 creates the expected initial state', () => {
    const state = createInitialState()

    expect(state.leftBank).toEqual(['farmer', 'wolf', 'goat', 'cabbage'])
    expect(state.rightBank).toEqual([])
    expect(state.status).toBe('in_progress')
  })

  it('TC-US-01-2 / US-01 AC-2 returns the legal initial moves', () => {
    const state = createInitialState()
    const moves = getAvailableMoves(state).map((move) => move.passenger)

    expect(moves).toEqual(['none', 'wolf', 'goat', 'cabbage'])
  })

  it('TC-US-01-3 / US-01 AC-3 applies a valid move and updates move history immediately', () => {
    const state = createInitialState()
    const result = attemptMove(state, 'goat')

    expect(result.resultType).toBe('move_applied')
    expect(result.state.leftBank).toEqual(['wolf', 'cabbage'])
    expect(result.state.rightBank).toEqual(['farmer', 'goat'])
    expect(result.state.boatSide).toBe('right')
    expect(result.state.moveHistory).toEqual([
      {
        fromSide: 'left',
        toSide: 'right',
        passenger: 'goat',
      },
    ])
  })

  it('TC-US-02-1 / US-02 AC-1 rejects an invalid move and explains why it is not allowed', () => {
    const initialState = createInitialState()
    const validMove = attemptMove(initialState, 'goat')
    const invalidMove = attemptMove(validMove.state, 'wolf')

    expect(invalidMove.resultType).toBe('invalid_move')
    expect(invalidMove.state).toEqual(validMove.state)
    expect(invalidMove.message).toContain('invalid because the wolf is not on the same bank as the farmer')
  })

  it('TC-US-02-2 / US-02 AC-2 flags a failure state after a valid but losing move', () => {
    const state = createInitialState()
    const result = attemptMove(state, 'wolf')

    expect(result.resultType).toBe('failure_state')
    expect(result.state.status).toBe('failed')
    expect(result.message).toContain('failure state')
  })

  it('TC-US-01-4 / US-01 AC-4 solves the puzzle for a known correct sequence', () => {
    let state = createInitialState()
    const sequence = ['goat', 'none', 'wolf', 'goat', 'cabbage', 'none', 'goat'] as const

    let finalResult = attemptMove(state, sequence[0])
    state = finalResult.state

    for (const passenger of sequence.slice(1)) {
      finalResult = attemptMove(state, passenger)
      state = finalResult.state
    }

    expect(finalResult.resultType).toBe('solved_state')
    expect(finalResult.state.status).toBe('solved')
    expect([...finalResult.state.rightBank].sort()).toEqual(['cabbage', 'farmer', 'goat', 'wolf'])
  })
})