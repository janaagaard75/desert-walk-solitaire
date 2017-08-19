import { computed } from 'mobx'
import { observable } from 'mobx'

import { ArrayUtilities } from './ArrayUtilities'
import { Card } from './Card'
import { Cell } from './Cell'
import { Suit } from './Suit'

export class Grid {
  constructor() {
    this.initializeDeck()
    this.initializeCells()
    this.shuffleDeckAndDealCards()
  }

  @observable public readonly cells: Array<Cell> = []
  public readonly columns = 14
  @observable public moves = 0
  @observable public shuffles = 0

  private readonly deck: Array<Card> = []
  private readonly rows = 4

  @computed
  public get cardsInCorrectPlace(): number {
    const cardsInCorrectPlace = this.cells.filter(cell => cell.cardIsInRightPlace).length
    return cardsInCorrectPlace
  }

  /** Cells that are empty or have a card in the wrong place. */
  @computed get cellsWithCardsNotInCorrectPlace(): Array<Cell> {
    const cellsWithCardsInWrongPlace = this.cells.filter(cell => !cell.cardIsInRightPlace)
    return cellsWithCardsInWrongPlace
  }

  @computed
  public get draggableCards(): Array<Card> {
    let draggableCards = this.emptyCells
      .map(cell => cell.cellToTheLeft)
      .filter(cellToTheLeft => cellToTheLeft !== undefined && cellToTheLeft.card !== undefined)
      .map(cell => ((cell as Cell).card as Card).next)
      .filter(nextCard => nextCard !== undefined) as Array<Card>

    const emptyCellsInFirstColumn = this.cells
      .filter(cell => cell.columnIndex === 0)
      .some(cell => cell.card === undefined)

    if (emptyCellsInFirstColumn) {
      const aces = this.cells
        .filter(cell => cell.card !== undefined && cell.card.value === 1)
        .map(cell => cell.card as Card)

      draggableCards = draggableCards.concat(aces)
    }

    return draggableCards
  }

  @computed
  public get emptyCells(): Array<Cell> {
    const emptyCells = this.cells.filter(cell => cell.card === undefined)
    return emptyCells
  }

  public cardIsDroppable(card: Card, cell: Cell): boolean {
    if (cell.cellToTheLeft === undefined) {
      const isAce = card.value === 1
      return isAce
    }

    if (cell.cellToTheLeft.card === undefined) {
      return false
    }

    const isNextCard
      = card.suit === cell.cellToTheLeft.card.suit
      && card.value === cell.cellToTheLeft.card.value + 1

    return isNextCard
  }

  public moveCard(from: Cell, to: Cell) {
    to.card = from.card
    from.card = undefined

    this.moves++

    // TODO: Is there a cleaner way to reset the hovered state?
    to.hoveredByCard = undefined
  }

  private initializeCells() {
    const theFourAces = this.deck.filter(card => card.value === 1)

    for (let rowIndex = 0; rowIndex < this.rows; rowIndex++) {
      for (let columnIndex = 0; columnIndex < this.columns; columnIndex++) {
        let cell: Cell
        if (columnIndex === 0) {
          cell = new Cell(rowIndex, columnIndex, undefined, theFourAces)
        }
        else {
          const cellToTheLeft = this.cells[this.cells.length - 1]
          cell = new Cell(rowIndex, columnIndex, cellToTheLeft, theFourAces)
        }

        this.cells.push(cell)
      }
    }
  }

  private initializeDeck() {
    for (const suit of [Suit.Clubs, Suit.Diamonds, Suit.Hearts, Suit.Spades]) {
      if (Suit.hasOwnProperty(suit)) {
        for (let value = 1; value <= 13; value++) {
          const card = new Card(suit, value)

          if (value !== 1) {
            this.deck[this.deck.length - 1].next = card
          }

          this.deck.push(card)
        }
      }
    }
  }

  public shuffleCardsInWrongPlace() {
    const cardsInWrongPlace = this.cellsWithCardsNotInCorrectPlace
      .map(cell => cell.card)
      .filter(card => card !== undefined) as Array<Card>

    ArrayUtilities.shuffleArray(cardsInWrongPlace)

    this.cellsWithCardsNotInCorrectPlace.forEach(cell => {
      if (cell.columnIndex === this.columns - 1) {
        cell.card = undefined
      }
      else {
        cell.card = cardsInWrongPlace.shift()
      }
    })

    this.shuffles++
  }

  public shuffleDeckAndDealCards() {
    ArrayUtilities.shuffleArray(this.deck)

    for (let rowIndex = 0; rowIndex < this.rows; rowIndex++) {
      for (let columnIndex = 0; columnIndex < this.columns; columnIndex++) {
        this.cells[rowIndex * this.columns + columnIndex].card
          = columnIndex === 0
            ? undefined
            : this.deck[rowIndex * (this.columns - 1) + (columnIndex - 1)]
      }
    }
  }
}