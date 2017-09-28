import { Cell } from './Cell'
import { Settings } from './Settings'

// TODO: Consider making the Grid class a singleton.
export class Grid {
  constructor() {
    for (let rowIndex = 0; rowIndex < Settings.instance.rows; rowIndex++) {
      for (let columnIndex = 0; columnIndex < Settings.instance.columns; columnIndex++) {
        let cellToTheLeft: Cell | undefined
        if (columnIndex === 0) {
          cellToTheLeft = undefined
        }
        else {
          cellToTheLeft = this.cells[this.cells.length - 1]
        }

        const cell = new Cell(rowIndex, columnIndex, cellToTheLeft)
        this.cells.push(cell)
      }
    }
  }

  public readonly cells: Array<Cell> = []
}