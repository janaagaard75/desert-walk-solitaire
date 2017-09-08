import { computed } from 'mobx'
import { observable } from 'mobx'

import { ArrayUtilities } from './ArrayUtilities'
import { Card } from './Card'
import { Cell } from './Cell'
import { GameStatus } from './GameStatus'
import { Settings } from './Settings'
import { Suit } from './Suit'

export class Game {
  constructor(
    private settings: Settings
  ) {
    this.initializeDeck()
    this.initializeCells()
    this.shuffleDeckAndDealCards()
    this.moveCardsIntoPositions()
  }

  @observable public readonly cells: Array<Cell> = []
  @observable public moves = 0
  @observable public shuffles = 0

  private readonly deck: Array<Card> = []

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

  @computed
  public get gameStatus(): GameStatus {
    if (this.draggableCards.length >= 1) {
      return GameStatus.MovePossible
    }

    // TODO: Avoid magic number.
    if (this.cardsInCorrectPlace === 52) {
      return GameStatus.GameWon
    }

    // TODO: Avoid magic number.
    if (this.shuffles <= 100) {
      return GameStatus.Stuck
    }

    return GameStatus.GameLost
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

    for (let rowIndex = 0; rowIndex < this.settings.rows; rowIndex++) {
      for (let columnIndex = 0; columnIndex < this.settings.columns; columnIndex++) {
        let cell: Cell
        if (columnIndex === 0) {
          cell = new Cell(rowIndex, columnIndex, undefined, theFourAces, this.settings)
        }
        else {
          const cellToTheLeft = this.cells[this.cells.length - 1]
          cell = new Cell(rowIndex, columnIndex, cellToTheLeft, theFourAces, this.settings)
        }

        this.cells.push(cell)
      }
    }
  }

  private initializeDeck() {
    for (const suit of [Suit.Clubs, Suit.Diamonds, Suit.Hearts, Suit.Spades]) {
      if (Suit.hasOwnProperty(suit)) {
        for (let value = 1; value <= this.settings.maxCardValue; value++) {
          const card = new Card(suit, value, this.settings)

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
      if (cell.columnIndex === this.settings.columns - 1) {
        cell.card = undefined
      }
      else {
        cell.card = cardsInWrongPlace.shift()
      }
    })

    this.shuffles++
  }

  private shuffleDeckAndDealCards() {
    ArrayUtilities.shuffleArray(this.deck)

    for (let rowIndex = 0; rowIndex < this.settings.rows; rowIndex++) {
      for (let columnIndex = 0; columnIndex < this.settings.columns; columnIndex++) {
        if (columnIndex === 0) {
          this.cells[rowIndex * this.settings.columns + columnIndex].card = undefined
        }
        else {
          this.cells[rowIndex * this.settings.columns + columnIndex].card = this.deck[rowIndex * (this.settings.columns - 1) + (columnIndex - 1)]
        }
      }
    }
  }

  private moveCardsIntoPositions() {
    this.cells
      // TODO: Make as Cells class that has a notEmpty() property.
      .filter(cell => cell.card !== undefined)
      .forEach(cell => {
        (cell.card as Card).position = cell.position
      })
  }

  public startOver() {
    this.shuffleDeckAndDealCards()
    this.moves = 0
    this.shuffles = 0
  }
}