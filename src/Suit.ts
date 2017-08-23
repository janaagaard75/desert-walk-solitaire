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
}