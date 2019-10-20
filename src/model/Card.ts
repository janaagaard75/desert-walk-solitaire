import { Suit } from "./Suit"
import { SuitHelper } from "./SuitHelper"

export class Card {
  public constructor(
    public readonly suit: Suit,
    public readonly value: number,
    public readonly next: Card | undefined
  ) {
    this.displayValue = this.getDisplayValue()
    this.key = this.getKey()
  }

  public readonly displayValue: string
  public readonly key: string

  private getDisplayValue(): string {
    switch (this.value) {
      case 1:
        return "A"

      case 11:
        return "J"

      case 12:
        return "Q"

      case 13:
        return "K"

      default:
        return this.value.toString()
    }
  }

  private getKey(): string {
    const key = this.displayValue + SuitHelper.getCharacter(this.suit)
    return key
  }
}
