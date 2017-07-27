import { Position } from './Position'

// TODO: Consider swapping out left and top with x and y, across the application.
export class Rectangle {
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