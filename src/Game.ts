import { computed } from 'mobx'
import { observable } from 'mobx'
import * as firebase from 'firebase'

// TODO: Figure out how to get a compiler error if this import is missing.
import './ArrayExtensions'
import { Card } from './Card'
import { CardCellPair } from './CardCellPair'
import { Cell } from './Cell'
import { Deck } from './Deck'
import { GameState } from './GameState'
import { GameSummary } from './GameSummary'
import { Grid } from './Grid'
import { GridState } from './GridState'
import { MoveTurn } from './MoveTurn'
import { OccupiedCell } from './OccupiedCell'
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

  @observable public draggedCardBoundary: Rectangle | undefined
  @observable public draggingFromCell: OccupiedCell | undefined

  @observable private currentStateIndex: number
  @observable private gridStates: Array<GridState>
  @observable private turns: Array<Turn>

  private gameSummary: GameSummary

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

    if (this.shuffles <= Settings.instance.numberOfShuffles) {
      return GameState.Stuck
    }

    return GameState.GameLost
  }

  // TODO: Use this when setting the state for empty cells.
  @computed
  public get mostOverlappedTargetableCell(): Cell | undefined {
    if (this.targetableCells.length === 0) {
      return undefined
    }

    const sortedByOverlappedPixels = this.targetableCells
      .sort((cellA, cellB) => cellB.draggedCardOverlappingPixels - cellA.draggedCardOverlappingPixels)

    const mostOverlapped = sortedByOverlappedPixels[0]
    return mostOverlapped
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
  private get targetableCells(): Array<Cell> {
    if (this.draggingFromCell === undefined) {
      return []
    }

    // TODO: It feels wrong to use currentGridState here. Should draggingFromCell be moved to the GridState class to keep things together, or would this just create another code smell, since it only make sense to have a dragged card on the current turn state.
    const emptyCellsAndDraggedFromCell = Game.instance.currentGridState.emptyCells
      .map(emptyCell => emptyCell.cell)
      .concat(this.draggingFromCell.cell)

    return emptyCellsAndDraggedFromCell
  }

  @computed
  public get undoPossible(): boolean {
    const undoPossible = this.currentStateIndex > 0
    return undoPossible
  }

  @computed
  private get previousGridState(): GridState {
    if (this.gridStates.length === 0) {
      throw new Error('The game hasn\'t been started yet.')
    }

    // If there aren't any moves yet, then use the current state as the previous one.
    if (this.gridStates.length === 1) {
      return this.currentGridState
    }

    return this.gridStates[this.gridStates.length - 2]
  }

  public cardDragged(draggedCard: Card, boundary: Rectangle) {
    Game.instance.draggedCardBoundary = boundary
  }

  public cardDragStarted(fromCell: OccupiedCell, boundary: Rectangle) {
    Game.instance.draggingFromCell = fromCell
    Game.instance.draggedCardBoundary = boundary
  }

  public cardDropped(from: Cell) {
    if (Game.instance.draggingFromCell === undefined) {
      throw new Error('draggedCard must be defined when handling a drop.')
    }

    if (Game.instance.draggedCardBoundary === undefined) {
      throw new Error('draggedCardBoundary must be defined when handling a drop.')
    }

    // Shadowing the variable to satisfy the TypeScript compiler below.
    const draggedCard = Game.instance.draggingFromCell.card
    const draggedCardBoundary = Game.instance.draggedCardBoundary

    // TODO: It should be possible to simplify this code using the existing computed values.

    const overlappedTargetableEmptyCells = Game.instance.currentGridState.emptyCells
      .filter(emptyCell => emptyCell.cardIsDroppable(draggedCard))
      .map(emptyCell => {
        return {
          cell: emptyCell.cell,
          overlappingPixels: emptyCell.cell.boundary.overlappingPixels(draggedCardBoundary),
        }
      })
      .filter(cellAndOverlap => cellAndOverlap.overlappingPixels > 0)
      .sort((cellAndOverlap1, cellAndOverlap2) => cellAndOverlap2.overlappingPixels - cellAndOverlap1.overlappingPixels)

    if (overlappedTargetableEmptyCells.length > 0) {
      const mostOverlappedCell = overlappedTargetableEmptyCells[0].cell
      Game.instance.moveCard(from, mostOverlappedCell)
    }

    Game.instance.draggingFromCell = undefined
    Game.instance.draggedCardBoundary = undefined
  }

  public moveCard(from: Cell, to: Cell) {
    this.performTurn(new MoveTurn(from, to))
  }

  public redo() {
    this.currentStateIndex++
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
    if (this.gameStatus === GameState.GameLost || this.gameStatus === GameState.GameWon) {
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

  // TODO: Consider making this the public method, and thus remove moveCard and shuffleCardsInIncorrectPlace.
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