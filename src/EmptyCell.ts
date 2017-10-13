import { computed } from 'mobx'

import { Card } from './Card'
import { Cell } from './Cell'
import { Deck } from './Deck'
import { EmptyCellStatus } from './EmptyCellStatus'

export class EmptyCell {
  constructor(
    public cell: Cell,
    private cardToTheLeft: Card | undefined,
  ) { }

  @computed
  public get droppableCards(): Array<Card> {
    if (this.cell.cellToTheLeft === undefined) {
      return Deck.instance.theFourAces
    }

    if (this.cardToTheLeft === undefined) {
      return []
    }

    if (this.cardToTheLeft.next === undefined) {
      return []
    }

    return [this.cardToTheLeft.next]
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
    if (this.cell.cellToTheLeft === undefined) {
      const isAce = card.value === 1
      return isAce
    }

    if (this.cardToTheLeft === undefined) {
      return false
    }

    const followsCardToTheLeft = card === this.cardToTheLeft.next
    return followsCardToTheLeft
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