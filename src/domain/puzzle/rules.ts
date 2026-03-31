import type { BankSide, Move, MovePassenger } from './move'
import type { PuzzleItem, TransportableItem } from './puzzle-item'

function includesAll(bank: ReadonlySet<PuzzleItem>, items: PuzzleItem[]) {
  return items.every((item) => bank.has(item))
}

export function getOppositeSide(side: BankSide): BankSide {
  return side === 'left' ? 'right' : 'left'
}

export function isPassengerAvailable(
  bank: ReadonlySet<PuzzleItem>,
  passenger: MovePassenger,
): boolean {
  return passenger === 'none' ? true : bank.has(passenger)
}

export function isFailureBank(bank: ReadonlySet<PuzzleItem>): boolean {
  if (bank.has('farmer')) {
    return false
  }

  return includesAll(bank, ['wolf', 'goat']) || includesAll(bank, ['goat', 'cabbage'])
}

export function isFailureState(leftBank: ReadonlySet<PuzzleItem>, rightBank: ReadonlySet<PuzzleItem>) {
  return isFailureBank(leftBank) || isFailureBank(rightBank)
}

export function isSolvedState(rightBank: ReadonlySet<PuzzleItem>) {
  return includesAll(rightBank, ['farmer', 'wolf', 'goat', 'cabbage'])
}

export function createMove(fromSide: BankSide, passenger: MovePassenger): Move {
  return {
    fromSide,
    toSide: getOppositeSide(fromSide),
    passenger,
  }
}

export function getCandidatePassengers(bank: ReadonlySet<PuzzleItem>): MovePassenger[] {
  const passengers: MovePassenger[] = ['none']
  const transportableItems: TransportableItem[] = ['wolf', 'goat', 'cabbage']

  for (const item of transportableItems) {
    if (bank.has(item)) {
      passengers.push(item)
    }
  }

  return passengers
}