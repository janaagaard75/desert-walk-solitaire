import { CardModel } from './CardModel'
import { CellStatus } from './CellStatus'

export class Cell {
  constructor(
    public readonly rowIndex: number,
    public readonly columnIndex: number,
    public readonly cellToTheLeft: Cell | undefined
  ) {
    this.card = undefined
    this.droppableCards = []
  }

  public card: CardModel | undefined
  public readonly droppableCards: Array<CardModel>

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