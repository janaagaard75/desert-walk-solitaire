import { computed } from 'mobx'

import { Card } from './Card'
import { Settings } from './Settings'
import { Suit } from './Suit'

export class Main {
  private constructor() {
  }

  private static _instance: Main | undefined

  public static get instance(): Main {
    if (this._instance === undefined) {
      this._instance = new Main()
    }

    return this._instance
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