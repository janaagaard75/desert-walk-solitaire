import { makeAutoObservable } from "mobx";
import { Card } from "./Card";
import { Cell } from "./Cell";
import { ComputedSettings } from "./ComputedSettings";
import { Deck } from "./Deck";
import { GridState } from "./GridState";
import { Point } from "./Point";
import { PositionedCard } from "./PositionedCard";
import { Rectangle } from "./Rectangle";

export class EmptyCell {
  public constructor(
    public cell: Cell,
    private gridState: GridState
  ) {
    makeAutoObservable(this);
  }

  public get boundary(): Rectangle {
    const boundary = ComputedSettings.instance.getCardBoundary(this.position);
    return boundary;
  }

  public get left(): PositionedCard | EmptyCell | undefined {
    if (this.cell.cellToTheLeft === undefined) {
      return undefined;
    }

    const left = this.gridState.getGridCellFromCell(this.cell.cellToTheLeft);
    return left;
  }

  public get position(): Point {
    return this.cell.position;
  }

  public get droppableCards(): ReadonlyArray<Card> {
    if (this.left === undefined) {
      return Deck.instance.theFourAces;
    }

    if (this.left instanceof EmptyCell) {
      return [];
    }

    if (this.left.card.next === undefined) {
      return [];
    }

    return [this.left.card.next];
  }
}
