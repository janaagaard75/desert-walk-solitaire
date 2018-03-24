import { computed } from 'mobx'
import { observable } from 'mobx'
import * as firebase from 'firebase'

import { Card } from './Card'
import { CardCellPair } from './CardCellPair'
import { Cell } from './Cell'
import { Deck } from './Deck'
import { GameState } from './GameState'
import { GameSummary } from './GameSummary'
import { Grid } from './Grid'
import { GridState } from './GridState'
import { MoveTurn } from './MoveTurn'
import { Point } from './Point'
import { Rectangle } from './Rectangle'
import { Settings } from './Settings'
import { ShuffleTurn } from './ShuffleTurn'
import { Turn } from './Turn'

import * as firebaseConfig from './firebaseConfig.json'

export class Game {
  private constructor() {
    this.startOver()
    firebase.initializeApp(firebaseConfig)
  }

  private static _instance: Game | undefined

  public static get instance(): Game {
    if (this._instance === undefined) {
      this._instance = new Game()
    }

    return this._instance
  }

  @observable public animateNextTurn: boolean = true
  @observable public draggedCardBoundary: Rectangle | undefined
  @observable public draggingFromCell: Card | undefined

  @observable private _currentStateIndex: number = 0
  @observable private gridStates: Array<GridState> = []
  @observable private turns: Array<Turn> = []

  private gameSummary: GameSummary | undefined

  @computed
  public get animateFromPreviousPosition(): boolean {
    if (this.latestTurn === undefined) {
      return false
    }

    if (this.latestTurn instanceof ShuffleTurn) {
      return true
    }

    const isLatestState = this.currentStateIndex === this.gridStates.length - 1
    return !isLatestState
  }

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

  @computed
  public get gameStatus(): GameState {
    if (this.currentGridState.draggableCards.length >= 1) {
      return GameState.MovePossible
    }

    if (this.currentGridState.correctlyPositionedCards.length === Settings.instance.numberOfCards) {
      return GameState.GameWon
    }

    if (this.shuffles < Settings.instance.numberOfShuffles) {
      return GameState.Stuck
    }

    return GameState.GameLost
  }

  @computed
  public get latestTurn(): Turn | undefined {
    if (this.turns.length === 0) {
      return undefined
    }

    const latestTurn = this.turns[this.turns.length - 1]
    return latestTurn
  }

  @computed
  public get mostOverlappedTargetableCell(): Cell | undefined {
    if (this.targetCells.length === 0) {
      return undefined
    }

    const sortedByOverlappedPixels = this.targetCells
      .filter(cell => cell.draggedCardOverlappingPixels > 0)
      .sort((cellA, cellB) => cellB.draggedCardOverlappingPixels - cellA.draggedCardOverlappingPixels)

    const mostOverlapped = sortedByOverlappedPixels[0]
    return mostOverlapped
  }

  @computed
  public get numberOfMoveTurns(): number {
    const moves = this.turns.filter(turn => turn instanceof MoveTurn).length
    return moves
  }

  @computed
  public get snapToOnDrop(): Cell {
    if (this.draggingFromCell === undefined) {
      throw new Error('No cell to snap to since currently not dragging a card.')
    }

    if (this.mostOverlappedTargetableCell !== undefined) {
      return this.mostOverlappedTargetableCell
    }

    return this.draggingFromCell.cell
  }

  @computed
  public get shuffles(): number {
    const shuffles = this.turns.filter(turn => turn instanceof ShuffleTurn).length
    return shuffles
  }

  @computed
  public get undoEnabled(): boolean {
    const isNotFirstState = this.currentStateIndex >= 1
    const lastTurn = this.turns[this.currentStateIndex - 1]
    const hasNotUndoed = this.currentStateIndex === this.gridStates.length - 1

    const undoPossible = isNotFirstState
      && lastTurn instanceof MoveTurn
      && hasNotUndoed

    return undoPossible
  }

  @computed
  private get currentStateIndex(): number {
    return this._currentStateIndex
  }

  @computed
  private get targetCells(): Array<Cell> {
    if (this.draggingFromCell === undefined) {
      return []
    }

    // Shadow variable to satify the TypeScript compiler below.
    const draggedCard = this.draggingFromCell.card

    const targetCells = this.currentGridState.emptyCells
      .filter(emptyCell => emptyCell.droppableCards.some(card => card === draggedCard))
      .map(emptyCell => emptyCell.cell)
      .concat(this.draggingFromCell.cell)

    return targetCells
  }

  public cardDragged(boundary: Rectangle) {
    this.draggedCardBoundary = boundary
  }

  public cardDragStarted(fromCell: Card) {
    this.draggingFromCell = fromCell
    this.draggedCardBoundary = fromCell.boundary
  }

  /** Returns the offset from the droppable target, if the card was let go over a droppeable target. Otherwize returns undefined. */
  public cardDropped(): Point | undefined {
    if (this.draggingFromCell === undefined) {
      throw new Error('draggedCard must be defined when handling a drop.')
    }

    if (this.draggedCardBoundary === undefined) {
      throw new Error('draggedCardBoundary must be defined when handling a drop.')
    }

    const targetCell = this.mostOverlappedTargetableCell
    if (targetCell === undefined) {
      return undefined
    }

    if (targetCell === this.draggingFromCell.cell) {
      return undefined
    }

    this.performTurn(new MoveTurn(this.draggingFromCell.cell, targetCell))

    const dropOffset = new Point(
      this.draggedCardBoundary.x1 - targetCell.position.x,
      this.draggedCardBoundary.y1 - targetCell.position.y
    )

    this.draggingFromCell = undefined
    this.draggedCardBoundary = undefined

    return dropOffset
  }

  public replay() {
    this.setCurrentStateIndex(0, false)

    window.setTimeout(() => this.waitAndGoToNextStateIndex(), Settings.instance.animation.replay.duration)
  }

  private waitAndGoToNextStateIndex() {
    if (this.currentStateIndex === this.gridStates.length - 1) {
      return
    }

    this.setCurrentStateIndex(this.currentStateIndex + 1, true)
    window.setTimeout(() => this.waitAndGoToNextStateIndex(), Settings.instance.animation.replay.duration)
  }

  public shuffleCardsInIncorrectPosition() {
    this.performTurn(new ShuffleTurn())
  }

  public startOver() {
    const shuffledCards = Deck.instance.cards.shuffle()
    const cellsExcludingFirstColumn = Grid.instance.cells.filter(cell => cell.columnIndex !== 0)

    const positions: Array<CardCellPair> = []
    for (let i = 0; i < shuffledCards.length; i++) {
      positions.push({
        card: shuffledCards[i],
        cell: cellsExcludingFirstColumn[i]
      })
    }

    this.gridStates = [new GridState(positions)]
    this.turns = []
    this.gameSummary = new GameSummary()
    this.setCurrentStateIndex(0, false)
  }

  public undo() {
    this.setCurrentStateIndex(this.currentStateIndex - 1, true)
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

    this.setCurrentStateIndex(this.currentStateIndex + 1, true)
    this.storeSummaryIfGameOver()
  }

  private setCurrentStateIndex(newIndex: number, animateNextTurn: boolean) {
    this.animateNextTurn = animateNextTurn
    this._currentStateIndex = newIndex
  }

  private storeGameSummary() {
    if (firebase.database === undefined) {
      throw new Error('firebase.database has to be defined.')
    }

    firebase.database().ref('gameSummaries').push(this.gameSummary)
  }

  private storeSummaryIfGameOver() {
    if (this.gameSummary === undefined) {
      return
    }

    if (this.gameStatus === GameState.GameLost || this.gameStatus === GameState.GameWon) {
      this.gameSummary.addFinalStep({
        cardsInPlace: this.currentGridState.correctlyPositionedCards.length,
        moves: this.numberOfMoveTurns
      })

      this.storeGameSummary()
    }
  }
}