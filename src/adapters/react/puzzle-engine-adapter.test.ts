import { describe, expect, it } from 'vitest'
import { applyPuzzleMove, createInitialPuzzleViewModel } from './puzzle-engine-adapter'

describe('puzzle-engine-adapter', () => {
  it('creates an initial view model from the pure engine state', () => {
    const viewModel = createInitialPuzzleViewModel()

    expect(viewModel.statusLabel).toBe('in progress')
    expect(viewModel.leftBank).toEqual(['farmer', 'wolf', 'goat', 'cabbage'])
    expect(viewModel.availableMoves).toEqual(['none', 'wolf', 'goat', 'cabbage'])
  })

  it('returns a UI-friendly failed result when the engine fails a move', () => {
    const initial = createInitialPuzzleViewModel()
    const updated = applyPuzzleMove(initial.state, 'wolf')

    expect(updated.statusLabel).toBe('failed')
    expect(updated.message).toContain('failure state')
    expect(updated.moveHistory).toEqual(['Farmer crossed with wolf from left to right'])
  })
})