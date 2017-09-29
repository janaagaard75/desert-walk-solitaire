import { computed } from 'mobx'

import { Card } from './Card'
import { Cell } from './Cell'
import { Deck } from './Deck'

export class EmptyCell extends Cell {
  constructor(
    cell: Cell,
    private cardToTheLeft: Card | undefined
  ) {
    super(cell.rowIndex, cell.columnIndex, cell.cellToTheLeft)
  }

  @computed
  public get droppableCards(): Array<Card> {
    if (this.cellToTheLeft === undefined) {
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
    if (this.hoveredByCard === undefined) {
      return false
    }

    const hoveredByDroppableCard = this.droppableCards.includes(this.hoveredByCard)
    return hoveredByDroppableCard
  }

  public cardIsDroppable(card: Card): boolean {
    if (this.cellToTheLeft === undefined) {
      const isAce = card.value === 1
      return isAce
    }

    if (this.cardToTheLeft === undefined) {
      return false
    }

    const followsCardToTheLeft = card === this.cardToTheLeft.next
    return followsCardToTheLeft
  }
}