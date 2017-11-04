import { computed } from 'mobx'

import { Point } from './Point'
import { Rectangle } from './Rectangle'
import { Settings } from './Settings'
import { Suit } from './Suit'
import { Value } from './Value'

export class Card {
  constructor(
    public readonly suit: Suit,
    public readonly value: Value,
    public readonly next: Card | undefined,
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
    const key = this.displayValue + Suit.toString(this.suit)
    return key
  }

  public static getBoundary(position: Point): Rectangle {
    const boundary = new Rectangle(
      position.x,
      position.x + Settings.instance.cardSize.width,
      position.y,
      position.y + Settings.instance.cardSize.height,
    )

    return boundary
  }
}