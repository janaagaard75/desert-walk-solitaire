import { computed } from 'mobx'
import { observable } from 'mobx'

import { Card } from './Card'
import { CardCellPair } from './CardCellPair'
import { CardPosition } from './CardPosition'
import { Cell } from './Cell'
import { Deck } from './Deck'
import { EmptyCell } from './EmptyCell'
import { Grid } from './Grid'
import { Turn } from './Turn'

export class GridState {
  public constructor(
    cardCellPairs: Array<CardCellPair>,
  ) {
    if (cardCellPairs.length !== Deck.instance.cards.length) {
      throw new Error(`Must supply ${Deck.instance.cards.length} card and cell pairs to the GridState constructor.`)
    }

    cardCellPairs.forEach(pair => {
      this.cardCellPairs.push(new CardPosition(pair.card, pair.cell, this))
    })
  }

  @observable
  public readonly cardCellPairs: Array<CardPosition> = []

  @computed
  public get correctlyPositionedCards(): Array<CardPosition> {
    const correctlyPositionedCards = this.cardCellPairs
      .filter(pair => pair.correctlyPlaced)
    return correctlyPositionedCards
  }

  @computed
  public get draggableCards(): Array<Card> {
    let draggableCards = this.emptyCells
      .map(emptyCell => emptyCell.cell.cellToTheLeft)
      .map(cellToTheLeft => this.getPairFromCell(cellToTheLeft))
      .map(pair => pair === undefined ? undefined : pair.card)
      .map(card => card === undefined ? undefined : card.next)
      // TODO: It should be possible to create a generic funtion for filtering out undefined values in an array, see https://stackoverflow.com/questions/43010737/way-to-tell-typescript-compiler-array-prototype-filter-removes-certain-types-fro.
      .filter((nextCard: Card | undefined): nextCard is Card => nextCard !== undefined)

    const emptyCellInFirstColumn = this.emptyCells
      .filter(emptyCell => emptyCell.cell.columnIndex === 0)
      .some(emptyCell => this.getPairFromCell(emptyCell.cell) === undefined)

    if (emptyCellInFirstColumn) {
      draggableCards = draggableCards.concat(Deck.instance.theFourAces)
    }

    return draggableCards
  }

  @computed
  public get emptyCells(): Array<EmptyCell> {
    const emptyCells = Grid.instance.cells
      .filter(cell => this.getPairFromCell(cell) === undefined)
      .map(cell => new EmptyCell(cell, this.getCardToTheLeft(cell)))

    return emptyCells
  }

  @computed
  public get incorrectlyPositionedCards(): Array<CardPosition> {
    const incorrectlyPositionedCards = this.cardCellPairs
      .filter(pair => !pair.correctlyPlaced)
    return incorrectlyPositionedCards
  }

  public applyTurn(turn: Turn): GridState {
    const newGridState = turn.performTurn(this)
    return newGridState
  }

  public getPairFromCard(card: Card): CardPosition {
    const match = this.cardCellPairs.find(pair => pair.card === card)

    if (match === undefined) {
      throw new Error(`Could not find pair with card ${card.key}.`)
    }

    return match
  }

  public getPairFromCell(cell: Cell | undefined): CardPosition | undefined {
    if (cell === undefined) {
      return undefined
    }

    const match = this.cardCellPairs.find(pair => pair.cell === cell)
    return match
  }

  private getCardToTheLeft(cell: Cell): Card | undefined {
    if (cell.cellToTheLeft === undefined) {
      return undefined
    }

    const pair = this.getPairFromCell(cell.cellToTheLeft)
    if (pair === undefined) {
      return undefined
    }

    return pair.card
  }
}