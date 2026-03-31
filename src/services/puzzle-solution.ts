import type { MovePassenger } from '../domain/puzzle/move'

const SOLUTION_SEQUENCE: MovePassenger[] = ['goat', 'none', 'wolf', 'goat', 'cabbage', 'none', 'goat']

export interface PuzzleSolutionStep {
  passenger: MovePassenger
  label: string
}

export function getPuzzleSolutionPath(): PuzzleSolutionStep[] {
  let currentSide: 'left' | 'right' = 'left'

  return SOLUTION_SEQUENCE.map((passenger) => {
    const fromSide = currentSide
    const toSide = currentSide === 'left' ? 'right' : 'left'
    currentSide = toSide

    return {
      passenger,
      label:
        passenger === 'none'
          ? `Farmer crosses alone from ${fromSide} to ${toSide}`
          : `Farmer takes ${passenger} from ${fromSide} to ${toSide}`,
    }
  })
}