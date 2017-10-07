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
import { MoveTurn } from './MoveTurn'
import { Settings } from './Settings'
import { ShuffleTurn } from './ShuffleTurn'
import { Turn } from './Turn'

import * as firebaseConfig from './firebaseConfig.json'

export class Game {
  constructor() {
    this.startOver()
    firebase.initializeApp(firebaseConfig)
  }

  @observable private currentStateIndex: number
  private gameSummary: GameSummary
  @observable private gridStates: Array<GridState>
  @observable private turns: Array<Turn>

  @computed
  public get currentGridState(): GridState {
    if (this.gridStates.length === 0) {
      throw new Error('The game hasn\'t been started yet.')
    }

    if (this.currentStateIndex < 0 || this.currentStateIndex > this.gridStates.length - 1) {
      throw new Error(`Can't access state index ${this.currentStateIndex} when there are ${this.gridStates.length} states.`)
    }

    return this.gridStates[this.currentStateIndex]
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

  @computed
  public get moves(): number {
    const moves = this.turns.filter(turn => turn instanceof MoveTurn).length
    return moves
  }

  @computed
  public get shuffles(): number {
    const shuffles = this.turns.filter(turn => turn instanceof ShuffleTurn).length
    return shuffles
  }

  @computed
  public get redoPossible(): boolean {
    const redoPossible = this.currentStateIndex < this.gridStates.length - 1
    return redoPossible
  }

  @computed
  public get undoPossible(): boolean {
    const undoPossible = this.currentStateIndex > 0
    return undoPossible
  }

  public moveCard(from: Cell, to: Cell) {
    this.performTurn(new MoveTurn(from, to))
  }

  public redo() {
    this.currentStateIndex++
  }

  public shuffleCardsInWrongPlace() {
    this.performTurn(new ShuffleTurn())
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
        cell: cellsExcludingFirstColumn[i],
      })
    }

    this.gridStates = [new GridState(positions)]
    this.turns = []
    this.gameSummary = new GameSummary()
    this.currentStateIndex = 0
  }

  private storeGameSummary() {
    firebase.database().ref('gameSummaries').push(this.gameSummary)
  }

  // TODO: Add a listener on correctlyPositionedCards.length instead of having to call this method manually.
  private storeSummaryIfGameOver() {
    if (this.gameStatus === GameStatus.GameLost || this.gameStatus === GameStatus.GameWon) {
      this.gameSummary.addFinalStep({
        cardsInPlace: this.currentGridState.correctlyPositionedCards.length,
        moves: this.moves,
      })

      this.storeGameSummary()
    }
  }

  public undo() {
    this.currentStateIndex--
  }

  private performTurn(turn: Turn) {
    const maxStateIndex = this.gridStates.length - 1
    if (this.currentStateIndex < maxStateIndex) {
      const turnsToDiscard = maxStateIndex - this.currentStateIndex
      this.gridStates = this.gridStates.slice(0, this.gridStates.length - turnsToDiscard)
      this.turns = this.turns.slice(0, this.turns.length - turnsToDiscard)
    }

    this.turns.push(turn)

    const newGridState = turn.performTurn(this.currentGridState)
    this.gridStates.push(newGridState)

    this.currentStateIndex++
    this.storeSummaryIfGameOver()
  }
}