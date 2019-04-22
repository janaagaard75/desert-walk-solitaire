export class Rectangle {
  constructor(
    public readonly x1: number,
    public readonly x2: number,
    public readonly y1: number,
    public readonly y2: number
  ) {}

  /** Returns the number of pixels this rectangle overlaps with another rectangle. */
  public overlappingPixels(otherRectangle: Rectangle): number {
    const overlappingX =
      Math.min(this.x2, otherRectangle.x2) -
      Math.max(this.x1, otherRectangle.x1)
    if (overlappingX < 0) {
      return 0
    }

    const overlappingY =
      Math.min(this.y2, otherRectangle.y2) -
      Math.max(this.y1, otherRectangle.y1)
    if (overlappingY < 0) {
      return 0
    }

    const overlappingPixels = overlappingX * overlappingY
    return overlappingPixels
  }
}
