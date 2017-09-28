import { computed } from 'mobx'
import { observable } from 'mobx'
import * as firebase from 'firebase'

// TODO: Figure out how to get a compiler error if this import is missing.
import './ArrayExtensions'
import { Cell } from './Cell'
import { Deck } from './Deck'
import { GameStatus } from './GameStatus'
import { GameSummary } from './GameSummary'
import { Grid } from './Grid'
import { IPositionedCard } from './IPositionedCard'
import { Settings } from './Settings'
import { TurnState } from './TurnState'

import * as firebaseConfig from './firebaseConfig.json'

export class Game {
  constructor() {
    this.startOver()
    firebase.initializeApp(firebaseConfig)
  }

  private readonly deck: Deck = new Deck()

  @observable public grid: Grid = new Grid()
  @observable public moves: number
  @observable public shuffles: number

  private gameSummary: GameSummary
  @observable private turnStates: Array<TurnState> = []

  @computed
  public get currentTurnState(): TurnState {
    if (this.turnStates.length === 0) {
      throw new Error('Game hasn\'t started yet.')
    }

    return this.turnStates[this.turnStates.length - 1]
  }

  @computed
  public get gameStatus(): GameStatus {
    if (this.currentTurnState.draggableCards.length >= 1) {
      return GameStatus.MovePossible
    }

    if (this.currentTurnState.correctlyPositionedCards.length === Settings.instance.numberOfCards) {
      return GameStatus.GameWon
    }

    if (this.shuffles <= Settings.instance.numberOfShuffles) {
      return GameStatus.Stuck
    }

    return GameStatus.GameLost
  }

  public moveCard(from: Cell, to: Cell) {
    const newTurnState = this.currentTurnState.moveCard(from, to)
    this.turnStates.push(newTurnState)
    this.moves++
    this.storeSummaryIfGameOver()
  }

  public shuffleCardsInWrongPlace() {
    const newTurnState = this.currentTurnState.shuffleCardsInWrongPlace()
    this.turnStates.push(newTurnState)
    this.shuffles++
    this.storeSummaryIfGameOver()
  }

  public startOver() {
    const shuffledCards = this.deck.cards.shuffle()
    const cellsExcludingFirstColumn = this.grid.cells.filter(cell => cell.columnIndex !== 0)

    // TODO: Pretty much the same code is repeated in TurnState.shuffleCardsInWrongPlace.
    if (shuffledCards.length !== cellsExcludingFirstColumn.length) {
      throw new Error('Number of cards must match number of cells')
    }

    const positions: Array<IPositionedCard> = []
    for (let i = 0; i < shuffledCards.length; i++) {
      positions.push({
        card: shuffledCards[i],
        cell: cellsExcludingFirstColumn[i]
      })
    }

    this.turnStates = [new TurnState(this.deck, this.grid, positions)]
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
        cardsInPlace: this.currentTurnState.correctlyPositionedCards.length,
        moves: this.moves
      })

      this.storeGameSummary()
    }
  }
}