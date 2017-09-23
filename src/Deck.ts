import { computed } from 'mobx'

import { ArrayUtilities } from './ArrayUtilities'
import { Card } from './Card'
import { Settings } from './Settings'
import { Suit } from './Suit'

export class Deck {
  constructor() {
    for (const suit of [Suit.Clubs, Suit.Diamonds, Suit.Hearts, Suit.Spades]) {
      if (Suit.hasOwnProperty(suit)) {
        // TODO: Consider initializing in reverse order and include 'next' in Card's constructor.
        for (let value = 1; value <= Settings.instance.maxCardValue; value++) {
          const card = new Card(suit, value)

          if (value !== 1) {
            this.cards[this.cards.length - 1].next = card
          }

          this.cards.push(card)
        }
      }
    }
  }

  public readonly cards: Array<Card> = []

  @computed
  public get theFourAces() {
    const theFourAces = this.cards.filter(card => card.value === 1)
    return theFourAces
  }

  public shuffle() {
    ArrayUtilities.shuffleArray(this.cards)
  }
}