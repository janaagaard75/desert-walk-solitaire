import { computed } from 'mobx'
import { observable } from 'mobx'

import { Cell } from './Cell'
import { Point } from './Point'
import { Rectangle } from './Rectangle'
import { Settings } from './Settings'
import { Suit } from './Suit'

export class Card {
  constructor(
    public readonly suit: Suit,
    public readonly value: number
  ) { }

  @observable public cell: Cell | undefined
  public next: Card | undefined
  @observable public draggedPosition: Point | undefined

  @computed
  public get boundary(): Rectangle {
    const surface = new Rectangle(
      this.position.x,
      this.position.x + Settings.instance.cardSize.width,
      this.position.y,
      this.position.y + Settings.instance.cardSize.height
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

  @computed
  public get position(): Point {
    if (this.draggedPosition !== undefined) {
      return this.draggedPosition
    }

    if (this.cell === undefined) {
      throw new Error('Card.cell must be defined.')
    }

    return this.cell.position
  }
}