import { describe, expect, it } from 'vitest'
import { getPuzzleSolutionPath } from './puzzle-solution'

describe('puzzle-solution', () => {
  it('returns a complete valid solution path for the classic puzzle', () => {
    const steps = getPuzzleSolutionPath()

    expect(steps.map((step) => step.passenger)).toEqual([
      'goat',
      'none',
      'wolf',
      'goat',
      'cabbage',
      'none',
      'goat',
    ])
    expect(steps[0]?.label).toContain('Farmer takes goat from left to right')
    expect(steps).toHaveLength(7)
  })
})