import { computed } from 'mobx'

import { PlayingCard } from './CardModel'
import { Cell } from './Cell'
import { Game } from './Game'
import { Deck } from './Deck'
import { EmptyCellState } from './EmptyCellState'
import { GridCell } from './GridCell'
import { GridState } from './GridState'

export class EmptyCell extends GridCell {
  constructor(
    cell: Cell,
    gridState: GridState
  ) {
    super(cell, gridState)
  }

  @computed
  public get droppableCards(): Array<PlayingCard> {
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
  public get status(): EmptyCellState {
    if (this.droppableCards.length === 0) {
      return EmptyCellState.Blocked
    }

    if (Game.instance.draggingFromCell === undefined) {
      return EmptyCellState.DropAllowedButNoCardIsBeingDragged
    }

    if (Game.instance.mostOverlappedTargetableCell === this.cell) {
      return EmptyCellState.MostOverlappedTargetableCell
    }

    const draggingFromCell = Game.instance.draggingFromCell
    if (this.droppableCards.some(card => card === draggingFromCell.card)) {
      return EmptyCellState.TargetableCellButNotMostOverlapped
    }

    return EmptyCellState.DropAllowedButNotTargetableCell
  }
}