import { computed } from 'mobx'

import { Card } from './Card'
import { Cell } from './Cell'
import { Deck } from './Deck'

export class EmptyCell {
  constructor(
    public cell: Cell,
    private cardToTheLeft: Card | undefined
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

    const hoveredByDroppableCard = this.droppableCards.includes(this.cell.hoveredByCard)
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
}