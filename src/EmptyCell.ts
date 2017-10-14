import { computed } from 'mobx'

import { Card } from './Card'
import { Cell } from './Cell'
import { Game } from './Game'
import { Deck } from './Deck'
import { EmptyCellStatus } from './EmptyCellStatus'
import { GridCell } from './GridCell'
import { GridState } from './GridState'

export class EmptyCell extends GridCell {
  constructor(
    cell: Cell,
    gridState: GridState,
  ) {
    super(cell, gridState)
  }

  @computed
  public get droppableCards(): Array<Card> {
    if (this.left === undefined) {
      return Deck.instance.theFourAces
    }

    if (this.left instanceof EmptyCell) {
      return []
    }

    if (this.left.card.next === undefined) {
      return []
    }

    return [this.left.card.next]
  }

  @computed
  public get status(): EmptyCellStatus {
    if (this.droppableCards.length === 0) {
      return EmptyCellStatus.Blocked
    }

    if (Game.instance.draggingFromCell === undefined) {
      return EmptyCellStatus.DropAllowedButNoCardIsBeingDragged
    }

    if (Game.instance.mostOverlappedTargetableCell === this.cell) {
      return EmptyCellStatus.MostOverlappedTargetableCell
    }

    const draggingFromCell = Game.instance.draggingFromCell
    if (this.droppableCards.some(card => card === draggingFromCell.card)) {
      return EmptyCellStatus.TargetableCellButNotMostOverlapped
    }

    return EmptyCellStatus.DropAllowedButNotTargetableCell
  }
}