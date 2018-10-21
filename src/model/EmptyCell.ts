import { computed } from 'mobx'

import { Card } from './Card'
import { Cell } from './Cell'
import { EmptyCellState } from './EmptyCellState'
import { Game } from './Game'
import { GridCell } from './GridCell'
import { GridState } from './GridState'
import { Main } from './Main'

export class EmptyCell extends GridCell {
  constructor(
    cell: Cell,
    gridState: GridState
  ) {
    super(cell, gridState)
  }

  @computed
  public get droppableCards(): ReadonlyArray<Card> {
    if (this.left === undefined) {
      return Main.instance.theFourAces
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

    if (this.droppableCards.some(card => {
      if (Game.instance.draggingFromCell === undefined) {
        return false
      }
      return card === Game.instance.draggedCard
    })) {
      return EmptyCellState.TargetableCellButNotMostOverlapped
    }

    return EmptyCellState.DropAllowedButNotTargetableCell
  }
}