import { Suit } from './Suit'

export class CardModel {
  constructor(
    public suit: Suit,
    public value: number
  ) { }
}