import { observer } from "mobx-react-lite";
import React from "react";
import { View, ViewStyle } from "react-native";
import { ComputedSettings } from "./model/ComputedSettings";
import { EmptyCell } from "./model/EmptyCell";
import { EmptyCellState } from "./model/EmptyCellState";
import { Game } from "./model/Game";
import { useComputed } from "./useComputed";

interface Props {
  emptyCell: EmptyCell;
}

export const EmptyCellView = observer((props: Props) => {
  const status = useComputed((): EmptyCellState => {
    if (props.emptyCell.droppableCards.length === 0) {
      return EmptyCellState.Blocked;
    }

    if (Game.instance.draggingFromCell === undefined) {
      return EmptyCellState.DropAllowedButNoCardIsBeingDragged;
    }

    // Don't have to take account of the cell currently being dragged from because this cell isn't considered empty until.
    if (Game.instance.mostOverlappedDroppableCell === props.emptyCell.cell) {
      return EmptyCellState.MostOverlappedTargetableCell;
    }

    if (
      props.emptyCell.droppableCards.some((card) => {
        if (Game.instance.draggingFromCell === undefined) {
          return false;
        }
        return card === Game.instance.draggedCard;
      })
    ) {
      return EmptyCellState.TargetableCellButNotMostOverlapped;
    }

    return EmptyCellState.DropAllowedButNotTargetableCell;
  });

  const getBorderColorStyleAndWidth = (): [
    string | undefined,
    "solid" | "dotted" | "dashed" | undefined,
    number,
  ] => {
    switch (status) {
      case EmptyCellState.Blocked:
        return [undefined, undefined, 0];

      case EmptyCellState.TargetableCellButNotMostOverlapped:
        return ["white", "dashed", ComputedSettings.instance.borderWidth];

      case EmptyCellState.DropAllowedButNoCardIsBeingDragged:
      case EmptyCellState.DropAllowedButNotTargetableCell:
        return ["black", "dashed", ComputedSettings.instance.borderWidth];

      case EmptyCellState.MostOverlappedTargetableCell:
        return ["white", "solid", ComputedSettings.instance.borderWidth];
    }
  };

  const [color, style, width] = getBorderColorStyleAndWidth();

  const emptyCellStyle: ViewStyle = {
    borderColor: color,
    borderRadius: ComputedSettings.instance.borderRadius,
    borderStyle: style,
    borderWidth: width,
    height: ComputedSettings.instance.cardSize.height,
    left: props.emptyCell.cell.position.x,
    position: "absolute",
    top: props.emptyCell.cell.position.y,
    width: ComputedSettings.instance.cardSize.width,
  };

  return <View style={emptyCellStyle} />;
});
