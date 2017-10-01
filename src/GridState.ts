import { computed } from 'mobx'
import { observable } from 'mobx'

import { Card } from './Card'
import { CardCellPair } from './CardCellPair'
import { Cell } from './Cell'
import { Deck } from './Deck'
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
      .forEach(pair => {
        this.cardCellPairs.push(
          new CardCellPair(pair.card, pair.cell, this.getCardCellPair(pair.cell.cellToTheLeft))
        )
      })
  }

  @observable
  public readonly cardCellPairs: Array<CardCellPair> = []

  @computed
  public get draggableCards(): Array<Card> {
    let draggableCards = this.emptyCells
      .map(emptyCell => emptyCell.cell.cellToTheLeft)
      .map(cellToTheLeft => this.getCardCellPair(cellToTheLeft))
      .map(pair => pair === undefined ? undefined : pair.card)
      .map(card => card === undefined ? undefined : card.next)
      // TODO: It should be possible to create a generic funtion for filtering out undefined values in an array, see https://stackoverflow.com/questions/43010737/way-to-tell-typescript-compiler-array-prototype-filter-removes-certain-types-fro.
      .filter((nextCard: Card | undefined): nextCard is Card => nextCard !== undefined)

    const emptyCellInFirstColumn = this.emptyCells
      .filter(emptyCell => emptyCell.cell.columnIndex === 0)
      .some(emptyCell => this.getCardCellPair(emptyCell.cell) === undefined)

    if (emptyCellInFirstColumn) {
      draggableCards = draggableCards.concat(Deck.instance.theFourAces)
    }

    return draggableCards
  }

  @computed
  public get correctlyPositionedCards(): Array<CardCellPair> {
    const correctlyPositionedCards = this.cardCellPairs
      .filter(pair => pair.correctlyPlaced)
    return correctlyPositionedCards
  }

  @computed
  private get incorrectlyPositionedCards(): Array<CardCellPair> {
    const incorrectlyPositionedCards = this.cardCellPairs
      .filter(pair => !pair.correctlyPlaced)
    return incorrectlyPositionedCards
  }

  @computed
  public get emptyCells(): Array<EmptyCell> {
    const emptyCells = Grid.instance.cells
      .filter(cell => this.getCardCellPair(cell) === undefined)
      .map(cell => new EmptyCell(cell, this.getCardToTheLeft(cell)))

    return emptyCells
  }

  // TODO: Create an abstract Turn class that is either a StartOverTurn, a MoveTurn or a ShuffleTurn, and have an apply method here in GridState that accepts a turn. Keep the turns in and array. That way moves and shuffles would become computed values. applyTurn(currentState: GridState): GridState.
  public moveCard(from: Cell, to: Cell): GridState {
    const fromPair = this.getCardCellPair(from)
    if (fromPair === undefined) {
      throw new Error('Could not find the \'from\' cell.')
    }
    if (fromPair.card === undefined) {
      throw new Error('The \'from\' cell must have a card.')
    }

    const toPair = this.getCardCellPair(to)
    if (toPair !== undefined) {
      throw new Error('The \'to\' cell is already defined.')
    }

    // TODO: Find a cleaner way to reset the hovered state.
    to.hoveredByCard = undefined

    const newCardCellPairs = this.cardCellPairs
      .map(pair => {
        return {
          card: pair.card,
          cell: pair.cell
        }
      })
      .filter(cardAndCell => cardAndCell.cell !== from)
      .concat([
        {
          card: fromPair.card,
          cell: to
        }
      ])

    const newGridState = new GridState(newCardCellPairs)
    return newGridState
  }

  public shuffleCardsInWrongPlace(): GridState {
    const shuffledCards = this.incorrectlyPositionedCards
      .map(pair => pair.card)
      .shuffle()

    const cellsExcludingLastColumn = this.incorrectlyPositionedCards
      .map(pair => pair.cell)
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

    const pair = this.getCardCellPair(cell.cellToTheLeft)
    if (pair === undefined) {
      return undefined
    }

    return pair.card
  }

  private getCardCellPair(cell: Cell | undefined): CardCellPair | undefined {
    if (cell === undefined) {
      return undefined
    }

    const match = this.cardCellPairs.find(pair => pair.cell === cell)
    return match
  }
}