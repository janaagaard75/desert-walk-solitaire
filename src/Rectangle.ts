import { Position } from './Position'

// TODO: Consider swapping out left and top with x and y, across the application.
export class Rectangle {
  constructor(
    public readonly topLeft: Position,
    public readonly bottomRight: Position
  ) { }

  public pointIsWithinBoundary(point: Position): boolean {
    const within
      = point.x >= this.topLeft.x
        && point.x <= this.bottomRight.x
        && point.y >= this.topLeft.y
        && point.y <= this.bottomRight.y

    return within
  }
}