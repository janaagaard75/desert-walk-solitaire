// import { computed } from 'mobx'
import { observable } from 'mobx'

// import { Card } from './Card'
import { Cell } from './Cell'
import { Settings } from './Settings'

export class Grid {
  constructor() {
    for (let rowIndex = 0; rowIndex < Settings.instance.rows; rowIndex++) {
      for (let columnIndex = 0; columnIndex < Settings.instance.columns; columnIndex++) {
        let cellToTheLeft: Cell | undefined
        if (columnIndex === 0) {
          cellToTheLeft = undefined
        }
        else {
          cellToTheLeft = this.cells[this.cells.length - 1]
        }

        const cell = new Cell(rowIndex, columnIndex, cellToTheLeft)
        this.cells.push(cell)
      }
    }
  }

  @observable
  public readonly cells: Array<Cell> = []

  // @computed
  // public get cellsWithCorrectlyPlacedCard(): Array<Cell> {
  //   const hasCorrectlyPlacedCard = this.cells.filter(cell => cell.cardIsCorrectlyPlaced)
  //   return hasCorrectlyPlacedCard
  // }

  // @computed
  // get cellsWithIncorrectlyPlacedCardOrThatAreEmpty(): Array<Cell> {
  //   const hasIncorrectlyPlacedCard = this.cells.filter(cell => !cell.cardIsCorrectlyPlaced)
  //   return hasIncorrectlyPlacedCard
  // }

  // @computed
  // public get draggableCards(): Array<Card> {
  //   let draggableCards = this.emptyCells
  //     .map(cell => cell.cellToTheLeft)
  //     .filter(cellToTheLeft => cellToTheLeft !== undefined && cellToTheLeft.card !== undefined)
  //     .map(cell => ((cell as Cell).card as Card).next)
  //     .filter(nextCard => nextCard !== undefined) as Array<Card>

  //   const emptyCellsInFirstColumn = this.cells
  //     .filter(cell => cell.columnIndex === 0)
  //     .some(cell => cell.card === undefined)

  //   if (emptyCellsInFirstColumn) {
  //     const aces = this.cells
  //       .filter(cell => cell.card !== undefined && cell.card.value === 1)
  //       .map(cell => cell.card as Card)

  //     draggableCards = draggableCards.concat(aces)
  //   }

  //   return draggableCards
  // }

  // @computed
  // public get emptyCells(): Array<Cell> {
  //   const emptyCells = this.cells.filter(cell => cell.card === undefined)
  //   return emptyCells
  // }

  // public moveCard(from: Cell, to: Cell) {
  //   // TODO: Make Cell abstract and create the classes EmptyCell and OccupiedCell to avoid these checks.
  //   if (from.card === undefined) {
  //     throw new Error('from.card must be defined.')
  //   }

  //   if (to.card !== undefined) {
  //     throw new Error('to.card cannot be defined.')
  //   }

  //   to.card = from.card
  //   from.card = undefined

  //   to.card.cellPosition = to.position
  //   to.card.draggedPosition = undefined

  //   // TODO: Is there a cleaner way to reset the hovered state?
  //   to.hoveredByCard = undefined
  // }
}