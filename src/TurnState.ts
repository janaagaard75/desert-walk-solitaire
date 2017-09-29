import { computed } from 'mobx'
import { observable } from 'mobx'

import { Card } from './Card'
import { CardCellPair } from './CardCellPair'
import { Cell } from './Cell'
import { Deck } from './Deck'
import { DraggableCard } from './DraggableCard'
import { EmptyCell } from './EmptyCell'
import { Grid } from './Grid'
import { Settings } from './Settings'

// TODO: Rename to GridState.
export class TurnState {
  public constructor(
    cardCellPairs: Array<CardCellPair>
  ) {
    cardCellPairs
      .sort((a, b) => a.cell.key - b.cell.key)
      .forEach(cardCellPair => {
        this.positionedCards.push(
          new DraggableCard(cardCellPair.card, cardCellPair.cell, this.getPositionedCard(cardCellPair.cell.cellToTheLeft))
        )
      })
  }

  // TODO: Consider creating a PositionedCards class.
  @observable
  public readonly positionedCards: Array<DraggableCard> = []

  @computed
  public get draggableCards(): Array<Card> {
    let draggableCards = this.emptyCells
      .map(cell => cell.cellToTheLeft)
      // TODO: Is it possible to avoid these conveluted constructs by introducing an UndefinedCard special class etc.? And if not, then at least create a generic helper method.
      .filter((cellToTheLeft: Cell | undefined): cellToTheLeft is Cell => cellToTheLeft !== undefined)
      .map(cellToTheLeft => this.getPositionedCard(cellToTheLeft))
      .filter((positionedCard: DraggableCard | undefined): positionedCard is DraggableCard => positionedCard !== undefined)
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
  public get correctlyPositionedCards(): Array<DraggableCard> {
    const correctlyPositionedCards = this.positionedCards
      .filter(positionedCard => positionedCard.correctlyPlaced)
    return correctlyPositionedCards
  }

  @computed
  private get incorrectlyPositionedCards(): Array<DraggableCard> {
    const incorrectlyPositionedCards = this.positionedCards
      .filter(positionedCard => !positionedCard.correctlyPlaced)
    return incorrectlyPositionedCards
  }

  @computed
  public get emptyCells(): Array<EmptyCell> {
    const emptyCells = Grid.instance.cells
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

    const newCardAndCellPairs = this.positionedCards
      .map(positionedCard => {
        return {
          card: positionedCard.card,
          cell: positionedCard.cell
        }
      })
      .filter(cardCellPair => cardCellPair.cell !== from)
      .concat([
        {
          card: fromPositionedCard.card,
          cell: to
        }
      ])

    // TODO: Find a cleaner way to reset the hovered state. Making hoveredByCard a computed value would probably fix this.
    to.hoveredByCard = undefined

    const newTurnState = new TurnState(newCardAndCellPairs)
    return newTurnState
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

    const newCardPositions: Array<CardCellPair> = []
    for (let i = 0; i < shuffledCards.length; i++) {
      newCardPositions.push({
        card: shuffledCards[i],
        cell: cellsExcludingLastColumn[i]
      })
    }

    const newTurnState = new TurnState(newCardPositions)
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

  private getPositionedCard(cell: Cell | undefined): DraggableCard | undefined {
    if (cell === undefined) {
      return undefined
    }

    const match = this.positionedCards.find(positionedCard => positionedCard.cell === cell)
    return match
  }
}