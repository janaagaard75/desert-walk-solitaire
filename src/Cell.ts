import { computed } from 'mobx'
import { observable } from 'mobx'

import { Card } from './Card'
import { Point } from './Point'
import { Rectangle } from './Rectangle'
import { Settings } from './Settings'

export class Cell {
  constructor(
    public readonly rowIndex: number,
    public readonly columnIndex: number,
    public readonly cellToTheLeft: Cell | undefined
  ) {
    this.key = this.rowIndex * Settings.instance.columns + this.columnIndex + 1
  }

  // TODO: Move this property to EmptyCell? It seems that it doesn't belong in Cell, since that class is now a child of the singleton Grid class.
  @observable public hoveredByCard: Card | undefined = undefined
  public readonly key: number

  @computed
  public get boundary(): Rectangle {
    const boundary = new Rectangle(
      this.position.x,
      this.position.x + Settings.instance.cardSize.width,
      this.position.y,
      this.position.y + Settings.instance.cardSize.height
    )

    return boundary
  }

  @computed
  public get position(): Point {
    const position = {
      x: this.columnIndex * (Settings.instance.cardSize.width + Settings.instance.gutterWidth),
      y: this.rowIndex * (Settings.instance.cardSize.height + Settings.instance.gutterWidth)
    }

    return position
  }
}