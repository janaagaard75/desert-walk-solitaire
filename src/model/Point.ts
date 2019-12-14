import { PointInterface } from "./PointInterface"

export class Point implements PointInterface {
  public constructor(public x: number, public y: number) {}

  public add(other: PointInterface): Point {
    const sum = new Point(this.x + other.x, this.y + other.y)
    return sum
  }

  public subtract(other: PointInterface): Point {
    const diff = new Point(this.x - other.x, this.y - other.y)
    return diff
  }

  public equals(other: Point): boolean {
    const areEqual = this.x === other.x && this.y === other.y
    return areEqual
  }
}
