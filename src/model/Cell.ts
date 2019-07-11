import { computed } from "mobx";

import { Point } from "./Point";
import { Rectangle } from "./Rectangle";
import { Settings } from "./Settings";

export class Cell {
  constructor(
    public readonly rowIndex: number,
    public readonly columnIndex: number,
    public readonly cellToTheLeft: Cell | undefined
  ) {
    this.key = this.rowIndex * Settings.instance.columns + this.columnIndex + 1;
  }

  public readonly key: number;

  @computed
  public get boundary(): Rectangle {
    const boundary = new Rectangle(
      this.position.x,
      this.position.x + Settings.instance.cardSize.width,
      this.position.y,
      this.position.y + Settings.instance.cardSize.height
    );

    return boundary;
  }

  @computed
  public get position(): Point {
    const position = new Point(
      this.columnIndex *
        (Settings.instance.cardSize.width + Settings.instance.gutterSize),
      this.rowIndex *
        (Settings.instance.cardSize.height + Settings.instance.gutterSize)
    );

    return position;
  }

  public getOverlappingPixels(boundary: Rectangle | undefined): number {
    if (boundary === undefined) {
      return 0;
    }

    const overlappingPixels = this.boundary.overlappingPixels(boundary);
    return overlappingPixels;
  }
}
