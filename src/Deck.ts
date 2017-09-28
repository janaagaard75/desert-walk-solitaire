import { computed } from 'mobx'

import { Card } from './Card'
import { Settings } from './Settings'
import { Suit } from './Suit'

export class Deck {
  private constructor() {
    const cards: Array<Card> = []
    for (const suit of [Suit.Clubs, Suit.Diamonds, Suit.Hearts, Suit.Spades]) {
      if (Suit.hasOwnProperty(suit)) {
        // TODO: Consider initializing in reverse order and include 'next' in Card's constructor.
        for (let value = 1; value <= Settings.instance.maxCardValue; value++) {
          const card = new Card(suit, value)

          if (value !== 1) {
            cards[cards.length - 1].next = card
          }

          cards.push(card)
        }
      }
    }

    this.cards = cards
  }

  public static readonly instance: Deck = new Deck()

  public readonly cards: ReadonlyArray<Card>

  @computed
  public get theFourAces(): Array<Card> {
    const theFourAces = this.cards.filter(card => card.value === 1)
    return theFourAces
  }
}