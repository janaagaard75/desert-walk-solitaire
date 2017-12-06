export class Point {
  constructor(
    public x: number,
    public y: number
  ) { }

  public subtract(other: Point): Point {
    const diff = new Point(
      this.x - other.x,
      this.y - other.y
    )

    return diff
  }

  public equals(other: Point): boolean {
    const areEqual = this.x === other.x && this.y === other.y
    return areEqual
  }
}