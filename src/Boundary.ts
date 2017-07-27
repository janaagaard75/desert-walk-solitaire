import { Position } from './Position'

export class Boundary {
  constructor(
    public readonly topLeft: Position,
    public readonly bottomRight: Position
  ) { }

  public pointIsWithinBoundary(point: Position): boolean {
    const within
      = point.left >= this.topLeft.left
        && point.left <= this.bottomRight.left
        && point.top >= this.topLeft.top
        && point.top <= this.bottomRight.top

    return within
  }
}