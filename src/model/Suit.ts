import { Settings } from './Settings'

export enum Suit {
  Clubs,
  Diamonds,
  Hearts,
  Spades
}

// tslint:disable-next-line:no-namespace
export namespace Suit {
  export const character = (suit: Suit): string => {
    switch (suit) {
      case Suit.Clubs: return '♣'
      case Suit.Diamonds: return '♦'
      case Suit.Hearts: return '♥'
      case Suit.Spades: return '♠'
    }
  }

  export const color = (suit: Suit): string => {
    switch (suit) {
      case Suit.Clubs:
        return Settings.instance.colors.card.clubs

      case Suit.Diamonds:
        return Settings.instance.colors.card.diamonds

      case Suit.Hearts:
        return Settings.instance.colors.card.hearts

      case Suit.Spades:
        return Settings.instance.colors.card.spades
    }
  }
}