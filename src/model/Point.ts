import { PointInterface } from "./PointInterface";

export class Point implements PointInterface {
  public constructor(public x: number, public y: number) {}

  public equals(other: Point): boolean {
    const areEqual = this.x === other.x && this.y === other.y;
    return areEqual;
  }
}
