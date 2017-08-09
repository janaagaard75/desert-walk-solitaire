import { Position } from './Position'

// TODO: Consider swapping out left and top with x and y, across the application.
export class Rectangle {
  constructor(
    public readonly x1: number,
    public readonly x2: number,
    public readonly y1: number,
    public readonly y2: number
  ) { }

  public pointIsWithinRectangle(point: Position): boolean {
    const within
      = point.x >= this.x1
        && point.x <= this.x2
        && point.y >= this.y1
        && point.y <= this.y2

    return within
  }
}