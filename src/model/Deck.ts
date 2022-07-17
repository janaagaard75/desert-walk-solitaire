import { Card } from "./Card";
import { Settings } from "./Settings";
import { Suit } from "./Suit";

export class Deck {
  private constructor() {
    this.cards = this.getCards();
    this.theFourAces = this.cards.filter((card) => card.value === 1);
  }

  private static _instance: Deck | undefined = undefined;

  public static get instance(): Deck {
    if (this._instance === undefined) {
      this._instance = new Deck();
    }

    return this._instance;
  }

  public cards: ReadonlyArray<Card>;
  public theFourAces: ReadonlyArray<Card>;

  private getCards(): ReadonlyArray<Card> {
    const cards: Array<Card> = [];
    for (const suit of [Suit.Clubs, Suit.Diamonds, Suit.Hearts, Suit.Spades]) {
      for (let value = Settings.maxCardValue; value >= 1; value--) {
        const nextCard =
          value === Settings.maxCardValue ? undefined : cards[cards.length - 1];

        cards.push(new Card(suit, value, nextCard));
      }
    }

    return cards;
  }
}
