import { computed } from "mobx"
import { Cell } from "./Cell"
import { Settings } from "./Settings"

export class Grid {
  private constructor() {}

  private static _instance: Grid

  public static get instance(): Grid {
    if (this._instance === undefined) {
      this._instance = new Grid()
    }

    return this._instance
  }

  @computed
  public get cells(): ReadonlyArray<Cell> {
    const cells: Array<Cell> = []
    for (let rowIndex = 0; rowIndex < Settings.instance.rows; rowIndex++) {
      for (
        let columnIndex = 0;
        columnIndex < Settings.instance.columns;
        columnIndex++
      ) {
        let cellToTheLeft: Cell | undefined
        if (columnIndex === 0) {
          cellToTheLeft = undefined
        } else {
          cellToTheLeft = cells[cells.length - 1]
        }

        const cell = new Cell(rowIndex, columnIndex, cellToTheLeft)
        cells.push(cell)
      }
    }

    return cells
  }
}
