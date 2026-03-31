import { beforeEach, describe, expect, it } from 'vitest'
import { clearPuzzleProgress, loadPuzzleProgress, savePuzzleProgress } from './puzzle-storage'
import { createInitialState } from '../../domain/puzzle/puzzle-state'

describe('puzzle-storage', () => {
  beforeEach(() => {
    clearPuzzleProgress()
  })

  it('saves and loads a stable puzzle snapshot', () => {
    const state = createInitialState()

    savePuzzleProgress(state, '2026-03-31T18:44:00.000Z')

    expect(loadPuzzleProgress()).toEqual({
      state,
      savedAt: '2026-03-31T18:44:00.000Z',
    })
  })

  it('returns null for missing or invalid persisted data', () => {
    expect(loadPuzzleProgress()).toBeNull()

    window.localStorage.setItem('river-crossing-puzzle.progress', '{not-json')
    expect(loadPuzzleProgress()).toBeNull()
  })
})