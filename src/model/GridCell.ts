import { computed } from "mobx"
import { Cell } from "./Cell"
import { EmptyCell } from "./EmptyCell"
import { GridState } from "./GridState"
import { Point } from "./Point"
import { PositionedCard } from "./PositionedCard"
import { Rectangle } from "./Rectangle"
import { Settings } from "./Settings"

export abstract class GridCell {
  public constructor(public cell: Cell, protected gridState: GridState) {}

  @computed
  public get boundary(): Rectangle {
    const boundary = Settings.instance.getCardBoundary(this.position)
    return boundary
  }

  @computed
  public get left(): PositionedCard | EmptyCell | undefined {
    if (this.cell.cellToTheLeft === undefined) {
      return undefined
    }

    const left = this.gridState.getGridCellFromCell(this.cell.cellToTheLeft)
    return left
  }

  @computed
  public get position(): Point {
    return this.cell.position
  }
}
