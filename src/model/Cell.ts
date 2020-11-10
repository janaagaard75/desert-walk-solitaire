import { computed, makeObservable } from "mobx"
import { ComputedSettings } from "./ComputedSettings"
import { Point } from "./Point"
import { Rectangle } from "./Rectangle"
import { Settings } from "./Settings"

export class Cell {
  public constructor(
    public readonly rowIndex: number,
    public readonly columnIndex: number,
    public readonly cellToTheLeft: Cell | undefined
  ) {
    makeObservable(this)
    this.key = this.rowIndex * Settings.columns + this.columnIndex + 1
  }

  public readonly key: number

  @computed
  public get boundary(): Rectangle {
    const boundary = new Rectangle(
      this.position.x,
      this.position.x + ComputedSettings.instance.cardSize.width,
      this.position.y,
      this.position.y + ComputedSettings.instance.cardSize.height
    )

    return boundary
  }

  @computed
  public get position(): Point {
    const position = new Point(
      this.columnIndex *
        (ComputedSettings.instance.cardSize.width +
          ComputedSettings.instance.gutterSize),
      this.rowIndex *
        (ComputedSettings.instance.cardSize.height +
          ComputedSettings.instance.gutterSize)
    )

    return position
  }

  public getOverlappingPixels(boundary: Rectangle | undefined): number {
    if (boundary === undefined) {
      return 0
    }

    const overlappingPixels = this.boundary.overlappingPixels(boundary)
    return overlappingPixels
  }
}
