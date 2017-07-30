import { computed } from 'mobx'
import { observable } from 'mobx'

import { Card } from './Card'
import { Cell } from './Cell'
import { Suit } from './Suit'

export class Grid {
  constructor() {
    for (const suit of [Suit.Clubs, Suit.Diamonds, Suit.Hearts, Suit.Spades]) {
      if (Suit.hasOwnProperty(suit)) {
        for (let i = 1; i <= 13; i++) {
          const card = new Card(suit, i)

          if (i !== 1) {
            this.deck[this.deck.length - 1].next = card
          }

          this.deck.push(card)
        }
      }
    }

    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.columns; c++) {
        let cell: Cell
        if (c === 0) {
          cell = new Cell(r, c, undefined)
        }
        else {
          const cellToTheLeft = this.cells[this.cells.length - 1]
          cell = new Cell(r, c, cellToTheLeft)
          cell.card = this.deck[(this.columns - 1) * r + (c - 1)]
        }

        this.cells.push(cell)
      }
    }
  }

  @observable public readonly cells: Array<Cell> = []
  public readonly columns = 14

  private readonly deck: Array<Card> = []
  private readonly rows = 4

  @computed
  public get draggableCards(): Array<Card> {
    let draggableCards = this.emptyCells
      .map(cell => cell.cellToTheLeft)
      .filter(cellToTheLeft => cellToTheLeft !== undefined && cellToTheLeft.card !== undefined)
      // TODO: Is it possible to avoid the casts?
      .map(cell => (cell as Cell).card as Card)

    const emptyCellsInFirstColumn = this.cells.filter(cell => cell.columnIndex === 0).some(cell => cell.card === undefined)
    if (emptyCellsInFirstColumn) {
      const aces = this.cells.filter(cell => cell.card !== undefined && cell.card.value === 1).map(cell => cell.card as Card)

      draggableCards = draggableCards.concat(aces)
    }

    return draggableCards
  }

  @computed
  public get emptyCells(): Array<Cell> {
    const emptyCells = this.cells.filter(cell => cell.isEmpty)
    return emptyCells
  }

  public moveCard(from: Cell, to: Cell) {
    to.card = from.card
    from.card = undefined

    // TODO: Is there a cleaner way to reset the hovered state?
    to.hoveredByCard = undefined
  }
}