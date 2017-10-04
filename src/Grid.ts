import { Cell } from './Cell'
import { Settings } from './Settings'

export class Grid {
  private constructor() {
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

  private static _instance: Grid

  public static get instance(): Grid {
    if (this._instance === undefined) {
      this._instance = new Grid()
    }

    return this._instance
  }

  public readonly cells: Array<Cell> = []
}