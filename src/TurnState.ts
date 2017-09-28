import { computed } from 'mobx'

import { Card } from './Card'
import { Cell } from './Cell'
import { Deck } from './Deck'
import { EmptyCell } from './EmptyCell'
import { Grid } from './Grid'
import { IPositionedCard } from './IPositionedCard'
import { PositionedCard } from './PositionedCard'
import { Settings } from './Settings'

// TODO: Rename to GridState.
export class TurnState {
  public constructor(
    private readonly grid: Grid,
    positionedCards: Array<IPositionedCard>
  ) {
    positionedCards
      .sort((a, b) => a.cell.key - b.cell.key)
      .forEach(positionedCard => {
        this.positionedCards.push(
          new PositionedCard(positionedCard.card, positionedCard.cell, this.getPositionedCard(positionedCard.cell.cellToTheLeft))
        )
      })
  }

  // TODO: Consider creating a PositionedCards class.
  // TODO: Consider making this a ReadonlyArray.
  public readonly positionedCards: Array<PositionedCard> = []

  @computed
  public get draggableCards(): Array<Card> {
    let draggableCards = this.emptyCells
      .map(cell => cell.cellToTheLeft)
      // TODO: Is it possible to avoid these conveluted constructs by introducing an UndefinedCard special class etc.? And if not, then at least create a generic helper method.
      .filter((cellToTheLeft: Cell | undefined): cellToTheLeft is Cell => cellToTheLeft !== undefined)
      .map(cellToTheLeft => this.getPositionedCard(cellToTheLeft))
      .filter((positionedCard: PositionedCard | undefined): positionedCard is PositionedCard => positionedCard !== undefined)
      .map(positionedCard => positionedCard.card.next)
      .filter((nextCard: Card | undefined): nextCard is Card => nextCard !== undefined)

    const emptyCellsInFirstColumn = this.emptyCells
      .filter(cell => cell.columnIndex === 0)
      .some(cell => this.getPositionedCard(cell) === undefined)

    if (emptyCellsInFirstColumn) {
      draggableCards = draggableCards.concat(Deck.instance.theFourAces)
    }

    return draggableCards
  }

  @computed
  public get correctlyPositionedCards(): Array<PositionedCard> {
    const correctlyPositionedCards = this.positionedCards
      .filter(positionedCard => positionedCard.correctlyPlaced)
    return correctlyPositionedCards
  }

  @computed
  private get incorrectlyPositionedCards(): Array<PositionedCard> {
    const incorrectlyPositionedCards = this.positionedCards
      .filter(positionedCard => !positionedCard.correctlyPlaced)
    return incorrectlyPositionedCards
  }

  @computed
  public get emptyCells(): Array<EmptyCell> {
    const emptyCells = this.grid.cells
      .filter(cell => this.getPositionedCard(cell) === undefined)
      .map(cell => new EmptyCell(cell, Deck.instance.theFourAces, this.getCardToTheLeft(cell)))
    return emptyCells
  }

  // TODO: Create an abstract Turn class that is either a StartOverTurn, a MoveTurn or a ShuffleTurn, and have an apply method here in TurnState that accepts a turn. Keep the turns in and array. That way moves and shuffles would become computed values. applyTurn(currentState: TurnState): TurnState.
  public moveCard(from: Cell, to: Cell): TurnState {
    const fromPositionedCard = this.getPositionedCard(from)
    if (fromPositionedCard === undefined) {
      throw new Error('Could not find the \'from\' cell.')
    }
    if (fromPositionedCard.card === undefined) {
      throw new Error('The \'from\' cell must have a card.')
    }

    const toPositionedCard = this.getPositionedCard(to)
    if (toPositionedCard !== undefined) {
      throw new Error('The \'to\' cell is already defined.')
    }

    const clone = this.clone()
    clone.addCard(fromPositionedCard.card, to)
    clone.removeCard(from)

    // TODO: Find a cleaner way to reset the hovered state.
    to.hoveredByCard = undefined

    return clone
  }

  public shuffleCardsInWrongPlace(): TurnState {
    const shuffledCards = this.incorrectlyPositionedCards
      .map(positionedCard => positionedCard.card)
      .shuffle()

    const cellsExcludingLastColumn = this.incorrectlyPositionedCards
      .map(positionedCard => positionedCard.cell)
      .concat(this.emptyCells)
      .filter(cell => cell.columnIndex !== Settings.instance.columns - 1)

    if (shuffledCards.length !== cellsExcludingLastColumn.length) {
      throw new Error(`The number of cards (${shuffledCards.length}) and cells (${cellsExcludingLastColumn.length}) have to match.`)
    }

    const newCardPositions: Array<IPositionedCard> = []
    for (let i = 0; i < shuffledCards.length; i++) {
      newCardPositions.push({
        card: shuffledCards[i],
        cell: cellsExcludingLastColumn[i]
      })
    }

    const newTurnState = new TurnState(this.grid, newCardPositions)
    return newTurnState
  }

  private addCard(card: Card, cell: Cell) {
    if (this.getPositionedCard(cell) !== undefined) {
      throw new Error('Can only put a card on an empty cell.')
    }

    this.positionedCards.push(new PositionedCard(card, cell, this.getPositionedCard(cell.cellToTheLeft)))
  }

  private clone(): TurnState {
    const newTurnState = new TurnState(this.grid, this.positionedCards)
    return newTurnState
  }

  private getCardToTheLeft(cell: Cell): Card | undefined {
    if (cell.cellToTheLeft === undefined) {
      return undefined
    }

    const positionedCard = this.getPositionedCard(cell.cellToTheLeft)
    if (positionedCard === undefined) {
      return undefined
    }

    return positionedCard.card
  }

  private getPositionedCard(cell: Cell | undefined): PositionedCard | undefined {
    if (cell === undefined) {
      return undefined
    }

    const match = this.positionedCards.find(positionedCard => positionedCard.cell === cell)
    return match
  }

  private removeCard(cell: Cell) {
    for (let i = this.positionedCards.length - 1; i >= 0; i--) {
      if (this.positionedCards[i].cell === cell) {
        this.positionedCards.splice(i, 1)
      }
    }
  }
}