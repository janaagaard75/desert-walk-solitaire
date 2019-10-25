interface PointLike {
  x: number
  y: number
}

export class Point implements PointLike {
  public constructor(public x: number, public y: number) {}

  public add(other: PointLike): Point {
    const sum = new Point(this.x + other.x, this.y + other.y)
    return sum
  }

  public subtract(other: PointLike): Point {
    const diff = new Point(this.x - other.x, this.y - other.y)
    return diff
  }

  public equals(other: Point): boolean {
    const areEqual = this.x === other.x && this.y === other.y
    return areEqual
  }
}
