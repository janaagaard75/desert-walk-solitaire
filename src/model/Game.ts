import { autorun, makeAutoObservable } from "mobx";
import { Card } from "./Card";
import { CardCellPair } from "./CardCellPair";
import { Cell } from "./Cell";
import { Deck } from "./Deck";
import { GameState } from "./GameState";
import { Grid } from "./Grid";
import { GridState } from "./GridState";
import { PositionedCard } from "./PositionedCard";
import { Rectangle } from "./Rectangle";
import { Settings } from "./Settings";
import { TouchableState } from "./TouchableState";
import { MoveTurn } from "./turn/MoveTurn";
import { ShuffleTurn } from "./turn/ShuffleTurn";
import { Turn } from "./turn/Turn";

export class Game {
  private constructor() {
    makeAutoObservable(this);
    this.startOver();
    autorun(() => {
      this.autorun();
    });
  }

  private static _instance: Game | undefined = undefined;

  public static get instance(): Game {
    if (this._instance === undefined) {
      this._instance = new Game();
    }

    return this._instance;
  }

  public animateNextTurn = true;
  public draggedCardBoundary: Rectangle | undefined;
  public draggingFromCell: PositionedCard | undefined;

  private _currentStateIndex = 0;
  private gridStates: Array<GridState> = [];
  private replayPlaying = false;
  private replayShown = false;
  private turns: Array<Turn> = [];

  public get animateFromPreviousPosition(): boolean {
    if (this.latestTurn === undefined) {
      return false;
    }

    if (this.latestTurn instanceof ShuffleTurn) {
      return true;
    }

    const isLatestState = this.currentStateIndex === this.gridStates.length - 1;
    return !isLatestState;
  }

  public get currentGridState(): GridState {
    if (this.gridStates.length === 0) {
      throw new Error("The game hasn't been started yet.");
    }

    if (
      this.currentStateIndex < 0
      || this.currentStateIndex > this.gridStates.length - 1
    ) {
      throw new Error(
        `Can't access state index ${this.currentStateIndex} when there are ${this.gridStates.length} states.`,
      );
    }

    return this.gridStates[this.currentStateIndex];
  }

  public get draggedCard(): Card | undefined {
    if (this.draggingFromCell === undefined) {
      return undefined;
    }

    return this.draggingFromCell.card;
  }

  public get gameState(): GameState {
    if (this.currentGridState.draggableCards.length >= 1) {
      return "movePossible";
    }

    if (
      this.currentGridState.correctlyPositionedCards.length
      === Settings.numberOfCards
    ) {
      return "won";
    }

    if (this.shuffles < Settings.numberOfShuffles) {
      return "shufflePossible";
    }

    return "lost";
  }

  public get latestTurn(): Turn | undefined {
    if (this.turns.length === 0) {
      return undefined;
    }

    const latestTurn = this.turns[this.turns.length - 1];
    return latestTurn;
  }

  public get mostOverlappedDroppableCell(): Cell | undefined {
    if (this.droppableCells.length === 0) {
      return undefined;
    }

    const sortedByOverlappedPixels = this.droppableCells
      .filter((cell) => cell.getOverlappingPixels(this.draggedCardBoundary) > 0)
      .sort(
        (cellA, cellB) =>
          cellB.getOverlappingPixels(this.draggedCardBoundary)
          - cellA.getOverlappingPixels(this.draggedCardBoundary),
      );

    const mostOverlapped = sortedByOverlappedPixels[0];
    return mostOverlapped;
  }

  public get numberOfMoveTurns(): number {
    const moves = this.turns.filter((turn) => turn instanceof MoveTurn).length;
    return moves;
  }

  public get snapToOnDrop(): Cell {
    if (this.draggingFromCell === undefined) {
      throw new Error(
        "No cell to snap to since currently not dragging a card.",
      );
    }

    if (this.mostOverlappedDroppableCell !== undefined) {
      return this.mostOverlappedDroppableCell;
    }

    return this.draggingFromCell.cell;
  }

  public get shuffles(): number {
    const shuffles = this.turns.filter(
      (turn) => turn instanceof ShuffleTurn,
    ).length;
    return shuffles;
  }

  public get undoState(): TouchableState {
    if (this.replayPlaying) {
      return "hidden";
    }

    const isFirstState = this.currentStateIndex === 0;
    const previousTurnWasMove =
      this.turns[this.currentStateIndex - 1] instanceof MoveTurn;
    const gameOver = this.gameState === "lost" || this.gameState === "won";

    if (isFirstState || !previousTurnWasMove || gameOver) {
      return "disabled";
    }

    return "enabled";
  }

  public get redoState(): TouchableState {
    if (this.replayPlaying) {
      return "hidden";
    }

    const isLastState = this.currentStateIndex === this.turns.length;

    if (isLastState) {
      return "disabled";
    }

    return "enabled";
  }

  private get currentStateIndex(): number {
    return this._currentStateIndex;
  }

  /** Returns the list of cells that the current card can be dropped on. This includes the cell being dragged from. See `targetableCells`. */
  private get droppableCells(): Array<Cell> {
    if (this.draggingFromCell === undefined) {
      return [];
    }

    const droppableCells = this.targetableCells.concat(
      this.draggingFromCell.cell,
    );
    return droppableCells;
  }

  public get replayEnabled(): boolean {
    const enabled = this.gameState === "won" && this.replayShown;
    return enabled;
  }

  /** Returns the list of cells that the current card can be moved to. This does not include the cell being currently moved from. See `droppableCells`. */
  private get targetableCells(): Array<Cell> {
    if (this.draggingFromCell === undefined) {
      return [];
    }

    const targetableCells = this.currentGridState.emptyCells
      .filter((emptyCell) =>
        emptyCell.droppableCards.some((card) => card === this.draggedCard),
      )
      .map((emptyCell) => emptyCell.cell);

    return targetableCells;
  }

  private autorun() {
    if (this.gameState === "won" && !this.replayShown) {
      setTimeout(() => {
        this.replay();
      }, Settings.animation.replay.delayBeforeAutoReplay);
    }
  }

  public cardDragged(boundary: Rectangle) {
    this.draggedCardBoundary = boundary;
  }

  public cardDragStarted(fromCell: PositionedCard) {
    this.draggingFromCell = fromCell;
    this.draggedCardBoundary = fromCell.boundary;
  }

  /** Called when a drag is ended. If the card is hovering over a droppable target a move turn is performed. `draggingFromCell` and `draggedCardBoundary` are always reset to `undefined`. Returns true if dropped over a droppable target. */
  public cardDropped(): boolean {
    if (
      this.draggingFromCell !== undefined
      && this.mostOverlappedDroppableCell !== undefined
      && this.mostOverlappedDroppableCell !== this.draggingFromCell.cell
    ) {
      this.performTurn(
        new MoveTurn(
          this.draggingFromCell.cell,
          this.mostOverlappedDroppableCell,
        ),
      );
      return true;
    }

    this.draggingFromCell = undefined;
    this.draggedCardBoundary = undefined;
    return false;
  }

  /** Moves a card to the first targetable cell. Aces are the only cards that can have multiple targets. */
  public moveCardToFirstTarget(positionedCard: PositionedCard): void {
    const targetCell = this.targetableCells[0];
    const moveTurn = new MoveTurn(positionedCard.cell, targetCell);
    this.performTurn(moveTurn);
  }

  public redo() {
    this.setCurrentStateIndex(this.currentStateIndex + 1, true);
  }

  public replay() {
    this.setCurrentStateIndex(0, false);
    this.replayShown = true;
    this.replayPlaying = true;

    setTimeout(() => {
      this.waitAndGoToNextStateIndex();
    }, Settings.animation.replay.duration);
  }

  private waitAndGoToNextStateIndex() {
    if (this.currentStateIndex === this.gridStates.length - 1) {
      this.replayPlaying = false;
      return;
    }

    this.setCurrentStateIndex(this.currentStateIndex + 1, true);
    setTimeout(() => {
      this.waitAndGoToNextStateIndex();
    }, Settings.animation.replay.duration);
  }

  public shuffleCardsInIncorrectPosition() {
    this.performTurn(new ShuffleTurn());
  }

  public startOver() {
    const shuffledCards = Deck.instance.cards.shuffle();
    const cellsExcludingFirstColumn = Grid.instance.cells.filter(
      (cell) => cell.columnIndex !== 0,
    );

    const positions: Array<CardCellPair> = [];
    for (let i = 0; i < shuffledCards.length; i++) {
      positions.push({
        card: shuffledCards[i],
        cell: cellsExcludingFirstColumn[i],
      });
    }

    // TODO: These values are also initialized when instantiating this class. Create a new class with these values to avoid duplicating this code (and simplifying this class)?
    // It's important to set the index to 0 before setting the array to an empty array.
    this.setCurrentStateIndex(0, false);
    this.gridStates = [new GridState(positions)];
    this.turns = [];
    this.replayShown = false;
  }

  public undo() {
    this.setCurrentStateIndex(this.currentStateIndex - 1, true);
  }

  private performTurn(turn: Turn) {
    const maxStateIndex = this.gridStates.length - 1;
    if (this.currentStateIndex < maxStateIndex) {
      const turnsToDiscard = maxStateIndex - this.currentStateIndex;
      this.gridStates = this.gridStates.slice(
        0,
        this.gridStates.length - turnsToDiscard,
      );
      this.turns = this.turns.slice(0, this.turns.length - turnsToDiscard);
    }

    const newGridState = turn.performTurn(this.currentGridState);

    this.turns.push(turn);
    this.gridStates.push(newGridState);
    this.setCurrentStateIndex(this.currentStateIndex + 1, true);
    this.draggingFromCell = undefined;
    this.draggedCardBoundary = undefined;
  }

  private setCurrentStateIndex(newIndex: number, animateNextTurn: boolean) {
    this.animateNextTurn = animateNextTurn;
    this._currentStateIndex = newIndex;
  }
}
