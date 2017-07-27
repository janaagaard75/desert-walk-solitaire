import { CardModel } from './CardModel'
import { Cell } from './Cell'
import { Size } from './Size'
import { Suit } from './Suit'

export class Grid {
  constructor() {
    for (const suit of [Suit.Clubs, Suit.Diamonds, Suit.Hearts, Suit.Spades]) {
      if (Suit.hasOwnProperty(suit)) {
        for (let i = 1; i <= 13; i++) {
          const card = new CardModel(suit, i)
          this.deck.push(card)
        }
      }
    }

    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.columns; c++) {
        let cell: Cell
        const position = {
          left: 10 + c * (this.cardSize.width + 5),
          top: 10 + r * (this.cardSize.height + 5)
        }

        if (c === 0) {
          cell = new Cell(r, c, position, this.cardSize, undefined)
        }
        else {
          cell = new Cell(r, c, position, this.cardSize, this.cells[this.cells.length])
          cell.card = this.deck[(this.columns - 1) * r + (c - 1)]
        }
        this.cells.push(cell)
      }
    }
  }

  public readonly cells: Array<Cell> = []
  public readonly cardSize: Size = {
    height: 60,
    width: 40
  }

  private readonly deck: Array<CardModel> = []
  private readonly columns = 14
  private readonly rows = 4

  public get emptyCells(): Array<Cell> {
    const emptyCells = this.cells.filter(cell => cell.isEmpty)
    return emptyCells
  }

  public moveCard(from: Cell, to: Cell) {
    to.card = from.card
    from.card = undefined
  }
}