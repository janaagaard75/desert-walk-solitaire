import { computed } from 'mobx'
import { observable } from 'mobx'

import { Card } from './Card'

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

    // Allow rearrange of aces in the first column.
    if (this.columnIndex === 0) {
      return true
    }

    // TODO: Currenly setting aces to draggable and every else to not draggable. Implement the correct algorith.
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
}