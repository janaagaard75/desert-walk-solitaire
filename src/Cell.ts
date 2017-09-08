import { computed } from 'mobx'
import { observable } from 'mobx'

import { Card } from './Card'
import { Point } from './Point'
import { Settings } from './Settings'

export class Cell {
  constructor(
    public readonly rowIndex: number,
    public readonly columnIndex: number,
    public readonly cellToTheLeft: Cell | undefined,
    private readonly theFourAces: Array<Card>,
    private readonly settings: Settings
  ) {
    this.key = this.rowIndex + '.' + this.columnIndex
  }

  @observable public card: Card | undefined = undefined
  @observable public hoveredByCard: Card | undefined = undefined
  public key: string

  @computed
  public get cardIsInRightPlace(): boolean {
    if (this.card === undefined) {
      return false
    }

    if (this.cellToTheLeft === undefined) {
      const aceInFirstColumn = this.card.value === 1
      return aceInFirstColumn
    }

    const followsCardToTheLeft = this.cellToTheLeft.cardIsInRightPlace
      && (this.cellToTheLeft.card as Card).next === this.card

    return followsCardToTheLeft
  }

  @computed
  public get droppableCards(): Array<Card> {
    if (this.cellToTheLeft === undefined) {
      return this.theFourAces
    }

    if (this.cellToTheLeft.card === undefined) {
      return []
    }

    if (this.cellToTheLeft.card.next === undefined) {
      return []
    }

    return [this.cellToTheLeft.card.next]
  }

  @computed
  public get hoveredByDroppableCard(): boolean {
    if (this.hoveredByCard === undefined) {
      return false
    }

    const hoveredByDroppableCard = this.droppableCards.includes(this.hoveredByCard)
    return hoveredByDroppableCard
  }

  @computed
  public get position(): Point {
    const position = {
      x: this.settings.gutterWidth + this.columnIndex * (this.settings.cardSize.width + this.settings.gutterWidth),
      y: this.settings.gutterWidth + this.rowIndex * (this.settings.cardSize.height + this.settings.gutterWidth)
    }

    return position
  }
}