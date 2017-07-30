import { computed } from 'mobx'
import { observable } from 'mobx'

import { Card } from './Card'
import { CellStatus } from './CellStatus'

export class Cell {
  constructor(
    public readonly rowIndex: number,
    public readonly columnIndex: number,
    public readonly cellToTheLeft: Cell | undefined
  ) {
    this.key = this.rowIndex + '.' + this.columnIndex
  }

  @observable public card: Card | undefined = undefined
  @observable public hoveredByCard: Card | undefined = undefined
  public key: string

  @computed
  public get cardIsDraggable(): boolean {
    if (this.card === undefined) {
      return false
    }

    if (this.columnIndex === 0) {
      return true
    }

    if (this.card.value === 1) {
      return true
    }

    return false
  }

  @computed
  public get isEmpty(): boolean {
    const isEmpty = this.card === undefined
    return isEmpty
  }

  @computed
  public get status(): CellStatus {
    if (this.isEmpty) {
      if (this.hoveredByCard === undefined) {
        return CellStatus.EmptyAndDraggedCardIsDroppable
      }

      return CellStatus.EmptyAndDropPossible
    }
    else {
      return CellStatus.OccupiedByDraggableCardInWrongPlace
    }
  }
}