import { computed } from 'mobx'

import { Card } from './Card'
import { Cell } from './Cell'
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
  public get hoveredByDroppableCard(): boolean {
    if (this.cell.hoveredByCard === undefined) {
      return false
    }

    const hoveredByDroppableCard = this.droppableCards.includes(this.cell.hoveredByCard.card)
    return hoveredByDroppableCard
  }

  public cardIsDroppable(card: Card): boolean {
    const droppable = this.droppableCards.some(droppableCard => droppableCard === card)
    return droppable
  }

  // TODO: Make this a computed value on the EmptyCell class. This requires making the draggedCard an observable.
  public getStatus(draggedCard: Card | undefined): EmptyCellStatus {
    if (this.droppableCards.length === 0) {
      return EmptyCellStatus.Blocked
    }

    if (draggedCard === undefined) {
      return EmptyCellStatus.DropAllowedAndNoCardIsBeingDragged
    }

    if (this.hoveredByDroppableCard) {
      return EmptyCellStatus.HoveredByDropableCard
    }

    if (draggedCard !== undefined) {
      if (this.droppableCards.some(card => card === draggedCard)) {
        return EmptyCellStatus.CurrentlyDraggedCardDroppable
      }
    }

    return EmptyCellStatus.DropAllowedButNotCurrentlyDraggedCard
  }
}