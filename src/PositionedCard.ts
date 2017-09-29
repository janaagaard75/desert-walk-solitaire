import { computed } from 'mobx'

import { Card } from './Card'
import { CardAndCell } from './CardAndCell'
import { Cell } from './Cell'
import { Point } from './Point'
import { Rectangle } from './Rectangle'
import { Settings } from './Settings'

// TODO: Rename to DraggableCard? (This means renaming the current DraggableCard to DraggableCardView.)
export class PositionedCard implements CardAndCell {
  constructor(
    public card: Card,
    public cell: Cell,
    private left: PositionedCard | undefined
  ) { }

  @computed
  public get boundary(): Rectangle {
    const boundary = PositionedCard.getBoundary(this.position)
    return boundary
  }

  @computed
  public get correctlyPlaced(): boolean {
    if (this.card === undefined) {
      return false
    }

    if (this.cell.cellToTheLeft === undefined) {
      const aceInFirstColumn = this.card.value === 1
      return aceInFirstColumn
    }

    if (this.left === undefined) {
      return false
    }

    const followsCardToTheLeft = this.left.correctlyPlaced && this.left.card.next === this.card
    return followsCardToTheLeft
  }

  @computed
  public get position(): Point {
    return this.cell.position
  }

  public static getBoundary(position: Point): Rectangle {
    const boundary = new Rectangle(
      position.x,
      position.x + Settings.instance.cardSize.width,
      position.y,
      position.y + Settings.instance.cardSize.height
    )

    return boundary
  }
}