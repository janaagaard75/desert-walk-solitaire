import { computed } from 'mobx'

import { Rectangle } from './Rectangle'
import { PositionedCard } from './PositionedCard'
import { Point } from './Point'
import { PlayingCardView } from './PlayingCardView'
import { GridState } from './GridState'
import { EmptyCell } from './EmptyCell'
import { Cell } from './Cell'

export abstract class GridCell {
  constructor(
    public cell: Cell,
    protected gridState: GridState
  ) { }

  @computed
  public get boundary(): Rectangle {
    const boundary = PlayingCardView.getBoundary(this.position)
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