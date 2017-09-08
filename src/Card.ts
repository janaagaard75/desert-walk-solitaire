import { computed } from 'mobx'
import { observable } from 'mobx'

import { Point } from './Point'
import { Rectangle } from './Rectangle'
import { Settings } from './Settings'
import { Suit } from './Suit'

export class Card {
  constructor(
    public readonly suit: Suit,
    public readonly value: number,
    private readonly settings: Settings
  ) { }

  public next: Card | undefined
  @observable public position: Point

  @computed
  public get boundary(): Rectangle {
    const surface = new Rectangle(
      this.position.x,
      this.position.x + this.settings.cardSize.width,
      this.position.y,
      this.position.y + this.settings.cardSize.height
    )

    return surface
  }

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
}