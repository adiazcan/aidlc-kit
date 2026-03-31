import type { TransportableItem } from './puzzle-item'

export type BankSide = 'left' | 'right'

export type MovePassenger = TransportableItem | 'none'

export interface Move {
  fromSide: BankSide
  toSide: BankSide
  passenger: MovePassenger
}