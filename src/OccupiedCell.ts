import { computed } from 'mobx'

import { Card } from './Card'
import { CardCellPair } from './CardCellPair'
import { Cell } from './Cell'
import { GridState } from './GridState'
import { Point } from './Point'
import { Rectangle } from './Rectangle'

export class OccupiedCell implements CardCellPair {
  constructor(
    public card: Card,
    public cell: Cell,
    private gridState: GridState,
  ) { }

  @computed
  public get boundary(): Rectangle {
    const boundary = Card.getBoundary(this.position)
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
  public get left(): OccupiedCell | undefined {
    const cardPositionToTheLeft = this.gridState.getPairFromCell(this.cell.cellToTheLeft)
    return cardPositionToTheLeft
  }

  @computed
  public get position(): Point {
    return this.cell.position
  }
}