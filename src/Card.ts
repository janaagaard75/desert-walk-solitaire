import { Suit } from './Suit'

export class Card {
  constructor(
    public readonly suit: Suit,
    public readonly value: number
  ) {
    this.displayValue = this.getDisplayValue()
  }

  public readonly displayValue: string
  public next: Card | undefined

  private getDisplayValue(): string {
    switch (this.value) {
      case 1:
        return 'A'

      case 11:
        return 'J'

      case 12:
        return 'Q'

      case 13:
        return 'K'

      default:
        return this.value.toString()
    }
  }
}