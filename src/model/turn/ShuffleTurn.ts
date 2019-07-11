import { CardCellPair } from "../CardCellPair";
import { GridState } from "../GridState";
import { Settings } from "../Settings";
import { Turn } from "./Turn";

/** Shuffle the cards that are incorrectly placed. */
export class ShuffleTurn extends Turn {
  public performTurn(gridState: GridState): GridState {
    const shuffledCards = gridState.incorrectlyPositionedCards
      .map(pair => pair.card)
      .shuffle();

    const cellsExcludingLastColumn = gridState.incorrectlyPositionedCards
      .map(pair => pair.cell)
      .concat(gridState.emptyCells.map(emptyCell => emptyCell.cell))
      .filter(cell => cell.columnIndex !== Settings.instance.columns - 1);

    if (shuffledCards.length !== cellsExcludingLastColumn.length) {
      throw new Error(
        `The number of cards (${shuffledCards.length}) and cells (${cellsExcludingLastColumn.length}) have to match.`
      );
    }

    const shuffledCardCellPairs: Array<CardCellPair> = [];
    for (let i = 0; i < shuffledCards.length; i++) {
      shuffledCardCellPairs.push({
        card: shuffledCards[i],
        cell: cellsExcludingLastColumn[i]
      });
    }

    const newCardCellPairs = shuffledCardCellPairs.concat(
      gridState.correctlyPositionedCards
    );

    const newGridState = new GridState(newCardCellPairs);
    return newGridState;
  }
}
