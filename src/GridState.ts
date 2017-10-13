import { computed } from 'mobx'
import { observable } from 'mobx'

import { Card } from './Card'
import { CardCellPair } from './CardCellPair'
import { Cell } from './Cell'
import { Deck } from './Deck'
import { EmptyCell } from './EmptyCell'
import { Grid } from './Grid'
import { OccupiedCell } from './OccupiedCell'
import { Turn } from './Turn'

export class GridState {
  public constructor(
    cardCellPairs: Array<CardCellPair>,
  ) {
    if (cardCellPairs.length !== Deck.instance.cards.length) {
      throw new Error(`Must supply ${Deck.instance.cards.length} card and cell pairs to the GridState constructor.`)
    }

    cardCellPairs.forEach(pair => {
      this.occupiedCells.push(new OccupiedCell(pair.cell, this, pair.card))
    })
  }

  @observable
  public readonly occupiedCells: Array<OccupiedCell> = []

  @computed
  public get correctlyPositionedCards(): Array<OccupiedCell> {
    const correctlyPositionedCards = this.occupiedCells
      .filter(pair => pair.correctlyPlaced)
    return correctlyPositionedCards
  }

  @computed
  public get draggableCards(): Array<Card> {
    let draggableCards = this.emptyCells
      .map(emptyCell => emptyCell.cell.cellToTheLeft)
      .map(cellToTheLeft => this.getOccupiedCellFromCell(cellToTheLeft))
      .map(occupiedCell => occupiedCell === undefined ? undefined : occupiedCell.card)
      .map(card => card === undefined ? undefined : card.next)
      .filter((nextCard: Card | undefined): nextCard is Card => nextCard !== undefined)

    const emptyCellInFirstColumn = this.emptyCells
      .filter(emptyCell => emptyCell.cell.columnIndex === 0)
      .some(emptyCell => this.getOccupiedCellFromCell(emptyCell.cell) === undefined)

    if (emptyCellInFirstColumn) {
      draggableCards = draggableCards.concat(Deck.instance.theFourAces)
    }

    return draggableCards
  }

  @computed
  public get emptyCells(): Array<EmptyCell> {
    const emptyCells = Grid.instance.cells
      .filter(cell => this.getOccupiedCellFromCell(cell) === undefined)
      .map(cell => new EmptyCell(cell, this))

    return emptyCells
  }

  @computed
  public get incorrectlyPositionedCards(): Array<OccupiedCell> {
    const incorrectlyPositionedCards = this.occupiedCells
      .filter(pair => !pair.correctlyPlaced)
    return incorrectlyPositionedCards
  }

  public applyTurn(turn: Turn): GridState {
    const newGridState = turn.performTurn(this)
    return newGridState
  }

  public getOccupiedCellFromCard(card: Card): OccupiedCell {
    const match = this.occupiedCells.find(pair => pair.card === card)

    if (match === undefined) {
      throw new Error(`Could not find pair with card ${card.key}.`)
    }

    return match
  }

  public getOccupiedCellFromCell(cell: Cell | undefined): OccupiedCell | undefined {
    if (cell === undefined) {
      return undefined
    }

    const match = this.occupiedCells.find(pair => pair.cell === cell)
    return match
  }

  public getGridCellFromCell(cell: Cell): EmptyCell | OccupiedCell {
    const occupiedCell = this.getOccupiedCellFromCell(cell)
    if (occupiedCell !== undefined) {
      return occupiedCell
    }

    const emptyCell = this.emptyCells.find(ec => ec.cell === cell)
    if (emptyCell === undefined) {
      throw new Error('Neither an occupied nor an empty cell found.')
    }

    return emptyCell
  }
}