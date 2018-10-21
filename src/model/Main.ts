import { computed } from 'mobx'

import { Card } from './Card'
import { Cell } from './Cell'
import { Settings } from './Settings'
import { Suit } from './Suit'

export class Main {
  private static _instance: Main | undefined

  public static get instance(): Main {
    if (this._instance === undefined) {
      this._instance = new Main()
    }

    return this._instance
  }

  @computed
  public get cells(): ReadonlyArray<Cell> {
    const cells: Array<Cell> = []
    for (let rowIndex = 0; rowIndex < Settings.instance.rows; rowIndex++) {
      for (let columnIndex = 0; columnIndex < Settings.instance.columns; columnIndex++) {
        let cellToTheLeft: Cell | undefined
        if (columnIndex === 0) {
          cellToTheLeft = undefined
        }
        else {
          cellToTheLeft = cells[cells.length - 1]
        }

        const cell = new Cell(rowIndex, columnIndex, cellToTheLeft)
        cells.push(cell)
      }
    }

    return cells
  }

  @computed
  public get deck(): ReadonlyArray<Card> {
    const cards: Array<Card> = []
    for (const suit of [Suit.Clubs, Suit.Diamonds, Suit.Hearts, Suit.Spades]) {
      for (let value = Settings.instance.maxCardValue; value >= 1; value--) {
        const nextCard = value === Settings.instance.maxCardValue
          ? undefined
          : cards[cards.length - 1]

        cards.push(new Card(suit, value, nextCard))
      }
    }

    return cards
  }

  @computed
  public get theFourAces(): ReadonlyArray<Card> {
    const theFourAces = this.deck.filter(card => card.value === 1)
    return theFourAces
  }
}