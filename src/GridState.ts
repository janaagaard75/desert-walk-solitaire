import { computed } from 'mobx'
import { observable } from 'mobx'

import { Card } from './Card'
import { Cell } from './Cell'
import { Deck } from './Deck'
import { DraggableCard } from './DraggableCard'
import { EmptyCell } from './EmptyCell'
import { Grid } from './Grid'
import { ICardCellPair } from './ICardCellPair'
import { Settings } from './Settings'

export class GridState {
  public constructor(
    cardCellPairs: Array<ICardCellPair>
  ) {
    if (cardCellPairs.length !== Deck.instance.cards.length) {
      throw new Error(`Must supply ${Deck.instance.cards.length} card and cell pairs to the GridState constructor.`)
    }

    cardCellPairs
      // Sort to make sure the cells are added left to right, so that cellToTheLeft is defined when used in the constructor below.
      .sort((a, b) => a.cell.key - b.cell.key)
      .forEach(cardCellPair => {
        this.draggableCards.push(
          new DraggableCard(cardCellPair.card, cardCellPair.cell, this.getDraggableCard(cardCellPair.cell.cellToTheLeft))
        )
      })
  }

  // TODO: Consider creating a DraggableCards class.
  @observable
  public readonly draggableCards: Array<DraggableCard> = []

  @computed
  public get draggableInCurrentTurn(): Array<Card> {
    let draggableCards = this.emptyCells
      .map(emptyCell => emptyCell.cell.cellToTheLeft)
      .map(cellToTheLeft => this.getDraggableCard(cellToTheLeft))
      .map(draggableCard => draggableCard === undefined ? undefined : draggableCard.card)
      .map(card => card === undefined ? undefined : card.next)
      // TODO: It should be possible to create a generic funtion for filtering out undefined values in an array, see https://stackoverflow.com/questions/43010737/way-to-tell-typescript-compiler-array-prototype-filter-removes-certain-types-fro.
      .filter((nextCard: Card | undefined): nextCard is Card => nextCard !== undefined)

    const emptyCellInFirstColumn = this.emptyCells
      .filter(emptyCell => emptyCell.cell.columnIndex === 0)
      .some(emptyCell => this.getDraggableCard(emptyCell.cell) === undefined)

    if (emptyCellInFirstColumn) {
      draggableCards = draggableCards.concat(Deck.instance.theFourAces)
    }

    return draggableCards
  }

  @computed
  public get correctlyPositionedCards(): Array<DraggableCard> {
    const correctlyPositionedCards = this.draggableCards
      .filter(draggableCard => draggableCard.correctlyPlaced)
    return correctlyPositionedCards
  }

  @computed
  private get incorrectlyPositionedCards(): Array<DraggableCard> {
    const incorrectlyPositionedCards = this.draggableCards
      .filter(draggableCard => !draggableCard.correctlyPlaced)
    return incorrectlyPositionedCards
  }

  @computed
  public get emptyCells(): Array<EmptyCell> {
    const emptyCells = Grid.instance.cells
      .filter(cell => this.getDraggableCard(cell) === undefined)
      .map(cell => new EmptyCell(cell, this.getCardToTheLeft(cell)))

    return emptyCells
  }

  // TODO: Create an abstract Turn class that is either a StartOverTurn, a MoveTurn or a ShuffleTurn, and have an apply method here in GridState that accepts a turn. Keep the turns in and array. That way moves and shuffles would become computed values. applyTurn(currentState: GridState): GridState.
  public moveCard(from: Cell, to: Cell): GridState {
    const fromDraggableCard = this.getDraggableCard(from)
    if (fromDraggableCard === undefined) {
      throw new Error('Could not find the \'from\' cell.')
    }
    if (fromDraggableCard.card === undefined) {
      throw new Error('The \'from\' cell must have a card.')
    }

    const toDraggableCard = this.getDraggableCard(to)
    if (toDraggableCard !== undefined) {
      throw new Error('The \'to\' cell is already defined.')
    }

    // TODO: Find a cleaner way to reset the hovered state.
    to.hoveredByCard = undefined

    const newCardCellPairs = this.draggableCards
      // TODO: Add a property to DraggableCard that does this mapping.
      .map(draggableCard => {
        return {
          card: draggableCard.card,
          cell: draggableCard.cell
        }
      })
      .filter(cardAndCell => cardAndCell.cell !== from)
      .concat([
        {
          card: fromDraggableCard.card,
          cell: to
        }
      ])

    const newGridState = new GridState(newCardCellPairs)
    return newGridState
  }

  public shuffleCardsInWrongPlace(): GridState {
    const shuffledCards = this.incorrectlyPositionedCards
      .map(draggableCard => draggableCard.card)
      .shuffle()

    const cellsExcludingLastColumn = this.incorrectlyPositionedCards
      .map(draggableCard => draggableCard.cell)
      .concat(this.emptyCells.map(emptyCell => emptyCell.cell))
      .filter(cell => cell.columnIndex !== Settings.instance.columns - 1)

    if (shuffledCards.length !== cellsExcludingLastColumn.length) {
      throw new Error(`The number of cards (${shuffledCards.length}) and cells (${cellsExcludingLastColumn.length}) have to match.`)
    }

    const shuffledCardCellPairs: Array<ICardCellPair> = []
    for (let i = 0; i < shuffledCards.length; i++) {
      shuffledCardCellPairs.push({
        card: shuffledCards[i],
        cell: cellsExcludingLastColumn[i]
      })
    }

    const newCardCellPairs = shuffledCardCellPairs.concat(this.correctlyPositionedCards)

    const newGridState = new GridState(newCardCellPairs)
    return newGridState
  }

  private getCardToTheLeft(cell: Cell): Card | undefined {
    if (cell.cellToTheLeft === undefined) {
      return undefined
    }

    const draggableCard = this.getDraggableCard(cell.cellToTheLeft)
    if (draggableCard === undefined) {
      return undefined
    }

    return draggableCard.card
  }

  private getDraggableCard(cell: Cell | undefined): DraggableCard | undefined {
    if (cell === undefined) {
      return undefined
    }

    const match = this.draggableCards.find(draggableCard => draggableCard.cell === cell)
    return match
  }
}