import { makeAutoObservable } from "mobx";
import { Card } from "./Card";
import { CardCellPair } from "./CardCellPair";
import { Cell } from "./Cell";
import { ComputedSettings } from "./ComputedSettings";
import { EmptyCell } from "./EmptyCell";
import { GridState } from "./GridState";
import { Point } from "./Point";
import { Rectangle } from "./Rectangle";

export class PositionedCard implements CardCellPair {
  public constructor(
    public cell: Cell,
    private gridState: GridState,
    public card: Card,
  ) {
    makeAutoObservable(this);
  }

  public get boundary(): Rectangle {
    const boundary = ComputedSettings.instance.getCardBoundary(this.position);
    return boundary;
  }

  public get left(): EmptyCell | PositionedCard | undefined {
    if (this.cell.cellToTheLeft === undefined) {
      return undefined;
    }

    const left = this.gridState.getGridCellFromCell(this.cell.cellToTheLeft);
    return left;
  }

  public get position(): Point {
    return this.cell.position;
  }

  public get correctlyPlaced(): boolean {
    if (this.cell.cellToTheLeft === undefined) {
      const aceInFirstColumn = this.card.value === 1;
      return aceInFirstColumn;
    }

    if (this.left === undefined) {
      return false;
    }

    if (this.left instanceof EmptyCell) {
      return false;
    }

    const followsCardToTheLeft =
      this.left.correctlyPlaced && this.left.card.next === this.card;
    return followsCardToTheLeft;
  }
}
