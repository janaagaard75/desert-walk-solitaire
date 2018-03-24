import { computed } from 'mobx'

import { CardModel } from './CardModel'
import { CardCellPair } from './CardCellPair'
import { Cell } from './Cell'
import { EmptyCell } from './EmptyCell'
import { Game } from './Game'
import { GridCell } from './GridCell'
import { GridState } from './GridState'

/** An occupied cells is a card that has a position on the grid. */
export class OccupiedCell extends GridCell implements CardCellPair {
  constructor(
    cell: Cell,
    gridState: GridState,
    public card: CardModel
  ) {
    super(cell, gridState)
  }

  @computed
  public get correctlyPlaced(): boolean {
    if (this.cell.cellToTheLeft === undefined) {
      const aceInFirstColumn = this.card.value === 1
      return aceInFirstColumn
    }

    if (this.left === undefined) {
      return false
    }

    if (this.left instanceof EmptyCell) {
      return false
    }

    const followsCardToTheLeft = this.left.correctlyPlaced && this.left.card.next === this.card
    return followsCardToTheLeft
  }

  @computed
  public get draggable(): boolean {
    const draggable = Game.instance.currentGridState.draggableCards.some(card => card === this.card)
    return draggable
  }
}