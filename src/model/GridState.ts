import { computed, makeObservable, observable } from "mobx"
import { Card } from "./Card"
import { CardCellPair } from "./CardCellPair"
import { Cell } from "./Cell"
import { Deck } from "./Deck"
import { EmptyCell } from "./EmptyCell"
import { Grid } from "./Grid"
import { PositionedCard } from "./PositionedCard"
import { Settings } from "./Settings"
import { Turn } from "./turn/Turn"

export class GridState {
  public constructor(cardCellPairs: Array<CardCellPair>) {
    makeObservable(this)
    if (cardCellPairs.length !== Deck.instance.cards.length) {
      throw new Error(
        `Must supply ${Deck.instance.cards.length} card and cell pairs to the GridState constructor.`
      )
    }

    cardCellPairs.forEach((pair) => {
      this.positionedCards.push(new PositionedCard(pair.cell, this, pair.card))
    })
  }

  @observable
  public readonly positionedCards: Array<PositionedCard> = []

  @computed
  public get correctlyPositionedCards(): Array<PositionedCard> {
    const correctlyPositionedCards = this.positionedCards.filter(
      (pair) => pair.correctlyPlaced
    )
    return correctlyPositionedCards
  }

  @computed
  public get draggableCards(): Array<Card> {
    const draggableNonAces = this.emptyCells
      .map((emptyCell) => emptyCell.cell.cellToTheLeft)
      .map((cellToTheLeft) => this.getPositionedCardFromCell(cellToTheLeft))
      .map((positionedCard) =>
        positionedCard === undefined ? undefined : positionedCard.card
      )
      .map((card) => (card === undefined ? undefined : card.next))
      .filter(
        (nextCard: Card | undefined): nextCard is Card => nextCard !== undefined
      )

    const draggableAces = this.positionedCards
      .filter((positionedCard) =>
        Deck.instance.theFourAces.includes(positionedCard.card)
      )
      .filter((cellWithAce) => !cellWithAce.correctlyPlaced)
      .map((cellWithAce) => cellWithAce.card)

    const draggableCards = draggableNonAces.concat(draggableAces)
    return draggableCards
  }

  @computed
  public get emptyCells(): Array<EmptyCell> {
    const emptyCells = Grid.instance.cells
      .filter((cell) => this.getPositionedCardFromCell(cell) === undefined)
      .map((cell) => new EmptyCell(cell, this))

    return emptyCells
  }

  @computed
  public get incorrectlyPositionedCards(): Array<PositionedCard> {
    const incorrectlyPositionedCards = this.positionedCards.filter(
      (pair) => !pair.correctlyPlaced
    )
    return incorrectlyPositionedCards
  }

  public applyTurn(turn: Turn): GridState {
    const newGridState = turn.performTurn(this)
    return newGridState
  }

  public getGridCellFromCell(cell: Cell): EmptyCell | PositionedCard {
    const positionedCard = this.getPositionedCardFromCell(cell)
    if (positionedCard !== undefined) {
      return positionedCard
    }

    const emptyCell = this.emptyCells.find((ec) => ec.cell === cell)
    if (emptyCell === undefined) {
      throw new Error("Neither an occupied nor an empty cell found.")
    }

    return emptyCell
  }

  public getPositionedCardFromCard(card: Card): PositionedCard {
    const match = this.positionedCards.find((pair) => pair.card === card)

    if (match === undefined) {
      throw new Error(`Could not find pair with card ${card.key}.`)
    }

    return match
  }

  public getPositionedCardFromCell(
    cell: Cell | undefined
  ): PositionedCard | undefined {
    if (cell === undefined) {
      return undefined
    }

    const match = this.positionedCards.find((pair) => pair.cell === cell)
    return match
  }

  @computed
  public static get inOrder(): GridState {
    const cardCellPairs: Array<CardCellPair> = []
    for (let rowIndex = 0; rowIndex < Settings.rows; rowIndex++) {
      for (let columnIndex = 1; columnIndex < Settings.columns; columnIndex++) {
        const cellIndex = rowIndex * Settings.columns + columnIndex

        // The deck of cards has been initialized in reverse order.
        const cardValue = Settings.maxCardValue - columnIndex + 1
        const cardIndex = rowIndex * Settings.columns + cardValue - 1 - rowIndex

        cardCellPairs.push({
          card: Deck.instance.cards[cardIndex],
          cell: Grid.instance.cells[cellIndex],
        })

        if (cardCellPairs[cardCellPairs.length - 1].card === undefined) {
          throw new Error(
            `cardCellPair[${cardCellPairs.length - 1}].card is not defined.`
          )
        }
      }
    }

    const gridState = new GridState(cardCellPairs)
    return gridState
  }
}
