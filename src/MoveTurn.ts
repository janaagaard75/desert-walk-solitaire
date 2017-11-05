import { Cell } from './Cell'
import { GridState } from './GridState'
import { Turn } from './Turn'

/** Move a card from one cell to another. */
export class MoveTurn extends Turn {
  constructor(
    private from: Cell,
    private to: Cell
  ) {
    super()
  }

  public performTurn(gridState: GridState): GridState {
    const fromPair = gridState.getOccupiedCellFromCell(this.from)
    if (fromPair === undefined) {
      throw new Error('Could not find the \'from\' cell.')
    }
    if (fromPair.card === undefined) {
      throw new Error('The \'from\' cell must have a card.')
    }

    const toPair = gridState.getOccupiedCellFromCell(this.to)
    if (toPair !== undefined) {
      throw new Error('The \'to\' cell is already defined.')
    }

    const newCardCellPairs = gridState.occupiedCells
      .map(pair => {
        return {
          card: pair.card,
          cell: pair.cell
        }
      })
      .filter(cardAndCell => cardAndCell.cell !== this.from)
      .concat([
        {
          card: fromPair.card,
          cell: this.to
        }
      ])

    const newGridState = new GridState(newCardCellPairs)
    return newGridState
  }
}