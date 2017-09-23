import { computed } from 'mobx'
import { observable } from 'mobx'

import { Card } from './Card'
import { Cell } from './Cell'
import { Settings } from './Settings'

export class Grid {
  constructor(
    theFourAces: Array<Card>
  ) {
    for (let rowIndex = 0; rowIndex < Settings.instance.rows; rowIndex++) {
      for (let columnIndex = 0; columnIndex < Settings.instance.columns; columnIndex++) {
        let cell: Cell
        if (columnIndex === 0) {
          cell = new Cell(theFourAces, rowIndex, columnIndex, undefined)
        }
        else {
          const cellToTheLeft = this.cells[this.cells.length - 1]
          cell = new Cell(theFourAces, rowIndex, columnIndex, cellToTheLeft)
        }

        this.cells.push(cell)
      }
    }
  }

  @observable
  public readonly cells: Array<Cell> = []

  @computed
  public get cellsWithCorrectlyPlacedCard(): Array<Cell> {
    const hasCorrectlyPlacedCard = this.cells.filter(cell => cell.cardIsCorrectlyPlaced)
    return hasCorrectlyPlacedCard
  }

  @computed
  get cellsWithIncorrectlyPlacedCardOrThatAreEmpty(): Array<Cell> {
    const hasIncorrectlyPlacedCard = this.cells.filter(cell => !cell.cardIsCorrectlyPlaced)
    return hasIncorrectlyPlacedCard
  }

  @computed
  public get emptyCells(): Array<Cell> {
    const emptyCells = this.cells.filter(cell => cell.card === undefined)
    return emptyCells
  }
}