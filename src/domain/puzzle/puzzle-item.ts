export const puzzleItems = ['farmer', 'wolf', 'goat', 'cabbage'] as const

export type PuzzleItem = (typeof puzzleItems)[number]

export type TransportableItem = Exclude<PuzzleItem, 'farmer'>