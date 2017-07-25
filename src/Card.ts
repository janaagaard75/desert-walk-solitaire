import { Suit } from './Suit'

export class CardModel {
  constructor(
    public suit: Suit,
    public value: number
  ) { }

  public get key(): string {
    const key = Suit[this.suit] + this.value
    return key
  }
}