import { CardModel } from './CardModel'
import { CellStatus } from './CellStatus'

export class Cell {
  constructor(
    public readonly rowIndex: number,
    public readonly columnIndex: number,
    public readonly cellToTheLeft: Cell | undefined
  ) {
    this.card = undefined
  }

  public card: CardModel | undefined

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

  public get key(): string {
    const key = this.rowIndex + '.' + this.columnIndex
    return key
  }

  public get status(): CellStatus {
    if (this.card === undefined) {
      return CellStatus.EmptyAndDropPossible
    }
    else {
      return CellStatus.OccupiedByDraggableCardInWrongPlace
    }
  }
}