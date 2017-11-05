export enum Suit {
  Clubs,
  Diamonds,
  Hearts,
  Spades
}

// tslint:disable-next-line:no-namespace
export namespace Suit {
  export const toString = (suit: Suit): string => {
    switch (suit) {
      case Suit.Clubs: return '♣'
      case Suit.Diamonds: return '♦'
      case Suit.Hearts: return '♥'
      case Suit.Spades: return '♠'
    }
  }
}