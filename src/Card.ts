import { computed } from 'mobx'
// import { observable } from 'mobx'

// import { Point } from './Point'
// import { Rectangle } from './Rectangle'
// import { Settings } from './Settings'
import { Suit } from './Suit'

export class Card {
  constructor(
    public readonly suit: Suit,
    public readonly value: number
  ) { }

  // @observable public cellPosition: Point | undefined
  // @observable public draggedPosition: Point | undefined
  public next: Card | undefined

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

  @computed get key(): string {
    const key = this.value.toString() + '.' + this.suit
    return key
  }
}