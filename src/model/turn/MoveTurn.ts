import { Cell } from "../Cell";
import { GridState } from "../GridState";
import { Turn } from "./Turn";

/** Move a card from one cell to another. */
export class MoveTurn extends Turn {
  public constructor(private from: Cell, private to: Cell) {
    super();
  }

  public performTurn(gridState: GridState): GridState {
    const fromPair = gridState.getPositionedCardFromCell(this.from);
    if (fromPair === undefined) {
      throw new Error("Could not find the 'from' cell.");
    }

    const toPair = gridState.getPositionedCardFromCell(this.to);
    if (toPair !== undefined) {
      throw new Error("The 'to' cell is already defined.");
    }

    const newCardCellPairs = gridState.positionedCards
      .map((pair) => {
        return {
          card: pair.card,
          cell: pair.cell,
        };
      })
      .filter((cardAndCell) => cardAndCell.cell !== this.from)
      .concat([
        {
          card: fromPair.card,
          cell: this.to,
        },
      ]);

    const newGridState = new GridState(newCardCellPairs);
    return newGridState;
  }
}
