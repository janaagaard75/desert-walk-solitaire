export enum Suit {
  Clubs,
  Diamonds,
  Hearts,
  Spades
}

// tslint:disable-next-line:no-namespace
export namespace Suit {
  export function isBlack(suit: Suit): boolean {
    return suit === Suit.Clubs || suit === Suit.Spades
  }
}