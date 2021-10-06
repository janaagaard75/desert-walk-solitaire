import { computed, makeObservable } from "mobx"
import { Card } from "./Card"
import { CardCellPair } from "./CardCellPair"
import { Cell } from "./Cell"
import { EmptyCell } from "./EmptyCell"
import { GridCell } from "./GridCell"
import { GridState } from "./GridState"

export class PositionedCard extends GridCell implements CardCellPair {
  public constructor(cell: Cell, gridState: GridState, public card: Card) {
    super(cell, gridState)

    makeObservable(this)

    if (card === undefined) {
      throw new Error("card must be defined.")
    }
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

    const followsCardToTheLeft =
      this.left.correctlyPlaced && this.left.card.next === this.card
    return followsCardToTheLeft
  }
}
