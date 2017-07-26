import { Boundary } from './Boundary'
import { CardModel } from './CardModel'
import { CellStatus } from './CellStatus'
import { Position } from './Position'
import { Size } from './Size'

export class Cell {
  constructor(
    public readonly rowIndex: number,
    public readonly columnIndex: number,
    public readonly position: Position,
    public readonly size: Size,
    public readonly cellToTheLeft: Cell | undefined
  ) {
    this.card = undefined
  }

  public card: CardModel | undefined

  public get boundary(): Boundary {
    const boundaries: Boundary = {
      bottomRight: {
        left: this.position.left + this.size.width,
        top: this.position.top + this.size.height
      },
      topLeft: {
        left: this.position.left,
        top: this.position.top
      }
    }

    return boundaries
  }

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