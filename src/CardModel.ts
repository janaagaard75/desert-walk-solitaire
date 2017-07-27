import { Suit } from './Suit'

export class CardModel {
  constructor(
    public readonly suit: Suit,
    public readonly value: number
  ) { }
}