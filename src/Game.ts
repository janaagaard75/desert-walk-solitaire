import { computed } from 'mobx'
import { observable } from 'mobx'
import * as firebase from 'firebase'

// TODO: Figure out how to get a compiler error if this import is missing.
import './ArrayExtensions'
import { CardCellPair } from './CardCellPair'
import { Cell } from './Cell'
import { Deck } from './Deck'
import { GameStatus } from './GameStatus'
import { GameSummary } from './GameSummary'
import { Grid } from './Grid'
import { GridState } from './GridState'
import { Settings } from './Settings'

import * as firebaseConfig from './firebaseConfig.json'

export class Game {
  constructor() {
    this.startOver()
    firebase.initializeApp(firebaseConfig)
  }

  @observable public moves: number
  @observable public shuffles: number

  private gameSummary: GameSummary
  @observable private gridStates: Array<GridState> = []

  @computed
  public get currentGridState(): GridState {
    if (this.gridStates.length === 0) {
      throw new Error('The game hasn\'t been started yet.')
    }

    return this.gridStates[this.gridStates.length - 1]
  }

  @computed get previousGridState(): GridState {
    if (this.gridStates.length === 0) {
      throw new Error('The game hasn\'t been started yet.')
    }

    // If there aren't any moves yet, then use the current state as the previous one.
    if (this.gridStates.length === 1) {
      return this.currentGridState
    }

    return this.gridStates[this.gridStates.length - 2]
  }

  @computed
  public get gameStatus(): GameStatus {
    if (this.currentGridState.draggableCards.length >= 1) {
      return GameStatus.MovePossible
    }

    if (this.currentGridState.correctlyPositionedCards.length === Settings.instance.numberOfCards) {
      return GameStatus.GameWon
    }

    if (this.shuffles <= Settings.instance.numberOfShuffles) {
      return GameStatus.Stuck
    }

    return GameStatus.GameLost
  }

  public moveCard(from: Cell, to: Cell) {
    const newGridState = this.currentGridState.moveCard(from, to)
    this.gridStates.push(newGridState)
    this.moves++
    this.storeSummaryIfGameOver()
  }

  public shuffleCardsInWrongPlace() {
    const newGridState = this.currentGridState.shuffleCardsInWrongPlace()
    this.gridStates.push(newGridState)
    this.shuffles++
    this.storeSummaryIfGameOver()
  }

  public startOver() {
    const shuffledCards = Deck.instance.cards.shuffle()
    const cellsExcludingFirstColumn = Grid.instance.cells.filter(cell => cell.columnIndex !== 0)

    // TODO: Pretty much the same code is repeated in GridState.shuffleCardsInWrongPlace.
    if (shuffledCards.length !== cellsExcludingFirstColumn.length) {
      throw new Error('Number of cards must match number of cells')
    }

    const positions: Array<CardCellPair> = []
    for (let i = 0; i < shuffledCards.length; i++) {
      positions.push({
        card: shuffledCards[i],
        cell: cellsExcludingFirstColumn[i]
      })
    }

    this.gridStates = [new GridState(positions)]
    this.gameSummary = new GameSummary()
    this.moves = 0
    this.shuffles = 0
  }

  private storeGameSummary() {
    firebase.database().ref('gameSummaries').push(this.gameSummary)
  }

  // TODO: Add a listener on correctlyPositionedCards.length instead of having to call this method manually.
  private storeSummaryIfGameOver() {
    if (this.gameStatus === GameStatus.GameLost || this.gameStatus === GameStatus.GameWon) {
      this.gameSummary.addFinalStep({
        cardsInPlace: this.currentGridState.correctlyPositionedCards.length,
        moves: this.moves
      })

      this.storeGameSummary()
    }
  }
}