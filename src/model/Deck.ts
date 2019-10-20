import { Card } from "./Card"
import { Settings } from "./Settings"
import { Suit } from "./Suit"

export class Deck {
  private constructor() {
    this._cards = []
    for (const suit of [Suit.Clubs, Suit.Diamonds, Suit.Hearts, Suit.Spades]) {
      for (let value = Settings.maxCardValue; value >= 1; value--) {
        const nextCard =
          value === Settings.maxCardValue
            ? undefined
            : this._cards[this._cards.length - 1]

        this._cards.push(new Card(suit, value, nextCard))
      }
    }

    this._theFourAces = this.cards.filter(card => card.value === 1)
  }

  private static _instance: Deck

  public static get instance(): Deck {
    if (this._instance === undefined) {
      this._instance = new Deck()
    }

    return this._instance
  }

  private _cards: Array<Card>
  private _theFourAces: Array<Card>

  public get cards(): ReadonlyArray<Card> {
    return this._cards
  }

  public get theFourAces(): ReadonlyArray<Card> {
    return this._theFourAces
  }
}
