import { Settings } from "./Settings";
import { Suit } from "./Suit";

export class SuitHelper {
  public static getCharacter(suit: Suit): string {
    switch (suit) {
      case "clubs":
        return "♣";
      case "diamonds":
        return "♦";
      case "hearts":
        return "♥";
      case "spades":
        return "♠";
    }
  }

  public static getColor(suit: Suit): string {
    switch (suit) {
      case "clubs":
        return Settings.colors.card.clubs;

      case "diamonds":
        return Settings.colors.card.diamonds;

      case "hearts":
        return Settings.colors.card.hearts;

      case "spades":
        return Settings.colors.card.spades;
    }
  }
}
