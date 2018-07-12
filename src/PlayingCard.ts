import { computed } from 'mobx'

import { CardValue } from './CardValue'
import { Suit } from './Suit'

export class PlayingCard {
  constructor(
    public readonly suit: Suit,
    public readonly value: CardValue,
    public readonly next: PlayingCard | undefined
  ) { }

  @computed
  public get displayValue(): string {
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

  @computed
  public get key(): string {
    const key = this.displayValue + Suit.character(this.suit)
    return key
  }
}