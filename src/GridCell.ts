import { computed } from 'mobx'

import { Cell } from './Cell'
import { EmptyCell } from './EmptyCell'
import { GridState } from './GridState'
import { OccupiedCell } from './OccupiedCell'

export abstract class GridCell {
  constructor(
    private cell: Cell,
    private gridState: GridState,
  ) { }

  @computed
  public get left(): OccupiedCell | EmptyCell | undefined {
    const left = this.gridState.getGridCellFromCell(this.cell)
    return left
  }
}