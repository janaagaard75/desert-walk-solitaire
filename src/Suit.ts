export enum Suit {
  Clubs,
  Diamonds,
  Hearts,
  Spades
}

// tslint:disable-next-line:no-namespace
export namespace Suit {
  export const color = (suit: Suit): string => {
    if (suit === Suit.Clubs || suit === Suit.Spades) {
      return 'black'
    }
    else {
      return 'red'
    }
  }

  export const unicode = (suit: Suit): string => {
    switch (suit) {
      case Suit.Clubs:
        return '\u2667'

      case Suit.Diamonds:
        return '\u2662'

      case Suit.Hearts:
        return '\u2661'

      case Suit.Spades:
        return '\u2664'
    }
  }
}