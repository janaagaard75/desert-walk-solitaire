import { computed } from 'mobx'

import { Card } from './Card'
import { CardValue } from './CardValue'
import { Settings } from './Settings'
import { Suit } from './Suit'

export class Deck {
  private constructor() {
    const cards: Array<Card> = []
    for (const suit of [Suit.Clubs, Suit.Diamonds, Suit.Hearts, Suit.Spades]) {
      if (Suit.hasOwnProperty(suit)) {
        for (let value = Settings.instance.maxCardValue; value >= 1; value--) {
          const nextCard = value === Settings.instance.maxCardValue
            ? undefined
            : cards[cards.length - 1]

          cards.push(new Card(suit, value as CardValue, nextCard))
        }
      }
    }

    this.cards = cards
  }

  private static _instance: Deck

  public static get instance(): Deck {
    if (this._instance === undefined) {
      this._instance = new Deck()
    }

    return this._instance
  }

  public readonly cards: ReadonlyArray<Card>

  @computed
  public get theFourAces(): ReadonlyArray<Card> {
    const theFourAces = this.cards.filter(card => card.value === 1)
    return theFourAces
  }
}