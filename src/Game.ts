import { computed } from 'mobx'
import { observable } from 'mobx'
import * as firebase from 'firebase'

import { ArrayUtilities } from './ArrayUtilities'
import { Card } from './Card'
import { Cell } from './Cell'
import { Deck } from './Deck'
import { GameStatus } from './GameStatus'
import { GameSummary } from './GameSummary'
import { Grid } from './Grid'
import { Settings } from './Settings'

import * as firebaseConfig from './firebaseConfig.json'

export class Game {
  constructor() {
    this.startOver()
    firebase.initializeApp(firebaseConfig)
  }

  private readonly deck: Deck = new Deck()

  public readonly grid: Grid = new Grid(this.deck.theFourAces)
  @observable public moves = 0
  @observable public shuffles = 0

  private gameSummary: GameSummary

  @computed
  public get draggableCards(): Array<Card> {
    let draggableCards = this.grid.emptyCells
      .map(cell => cell.cellToTheLeft)
      .filter(cellToTheLeft => cellToTheLeft !== undefined && cellToTheLeft.card !== undefined)
      .map(cell => ((cell as Cell).card as Card).next)
      .filter(nextCard => nextCard !== undefined) as Array<Card>

    const emptyCellsInFirstColumn = this.grid.cells
      .filter(cell => cell.columnIndex === 0)
      .some(cell => cell.card === undefined)

    if (emptyCellsInFirstColumn) {
      const aces = this.grid.cells
        .filter(cell => cell.card !== undefined && cell.card.value === 1)
        .map(cell => cell.card as Card)

      draggableCards = draggableCards.concat(aces)
    }

    return draggableCards
  }

  @computed
  public get gameStatus(): GameStatus {
    if (this.draggableCards.length >= 1) {
      return GameStatus.MovePossible
    }

    if (this.grid.cellsWithCorrectlyPlacedCard.length === Settings.instance.numberOfCards) {
      return GameStatus.GameWon
    }

    if (this.shuffles <= Settings.instance.numberOfShuffles) {
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
    // TODO: Make Cell abstract and create the classes EmptyCell and OccupiedCell to avoid these checks.
    if (from.card === undefined) {
      throw new Error('from.card must be defined.')
    }

    if (to.card !== undefined) {
      throw new Error('to.card cannot be defined.')
    }

    to.card = from.card
    from.card = undefined

    to.card.cell = to
    to.card.draggedPosition = undefined

    this.moves++

    // TODO: Is there a cleaner way to reset the hovered state?
    to.hoveredByCard = undefined

    this.storeSummaryIfGameOver()
  }

  public shuffleCardsInWrongPlace() {
    const cardsInWrongPlace = this.grid.cellsWithIncorrectlyPlacedCardOrThatAreEmpty
      .map(cell => cell.card)
      .filter(card => card !== undefined) as Array<Card>

    ArrayUtilities.shuffleArray(cardsInWrongPlace)

    this.grid.cellsWithIncorrectlyPlacedCardOrThatAreEmpty
      .forEach(cell => {
        if (cell.columnIndex === Settings.instance.columns - 1) {
          cell.card = undefined
        }
        else {
          cell.card = cardsInWrongPlace.shift()
          // TODO: Clean the code to remove these checks.
          if (cell.card === undefined) {
            throw new Error('cell.card must be defined here.')
          }
          cell.card.cell = cell
        }
      })

    this.shuffles++

    if (this.gameStatus === GameStatus.GameWon) {
      this.storeSummaryIfGameOver()
    }
    else {
      this.gameSummary.addStep({
        cardsInPlace: this.grid.cellsWithCorrectlyPlacedCard.length,
        moves: this.moves
      })
    }
  }

  public startOver() {
    this.deck.shuffle()

    for (let rowIndex = 0; rowIndex < Settings.instance.rows; rowIndex++) {
      for (let columnIndex = 0; columnIndex < Settings.instance.columns; columnIndex++) {
        const cell = this.grid.cells[rowIndex * Settings.instance.columns + columnIndex]
        if (columnIndex === 0) {
          cell.card = undefined
        }
        else {
          cell.card = this.deck.cards[rowIndex * (Settings.instance.columns - 1) + (columnIndex - 1)]
          cell.card.cell = cell
        }
      }
    }

    this.gameSummary = new GameSummary()
    this.moves = 0
    this.shuffles = 0
  }

  private storeGameSummary() {
    firebase.database().ref('gameSummaries').push(this.gameSummary)
  }

  private storeSummaryIfGameOver() {
    if (this.gameStatus === GameStatus.GameLost || this.gameStatus === GameStatus.GameWon) {
      this.gameSummary.addFinalStep({
        cardsInPlace: this.grid.cellsWithCorrectlyPlacedCard.length,
        moves: this.moves
      })

      this.storeGameSummary()
    }
  }
}