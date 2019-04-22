import { Settings } from './Settings'
import { Suit } from './Suit'

export class SuitHelper{
  public static getCharacter(suit: Suit): string {
    switch (suit) {
      case Suit.Clubs: return '♣'
      case Suit.Diamonds: return '♦'
      case Suit.Hearts: return '♥'
      case Suit.Spades: return '♠'
    }
  }

  public static getColor(suit: Suit): string {
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