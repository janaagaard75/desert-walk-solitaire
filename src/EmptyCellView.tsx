import { observer } from "mobx-react-lite";
import React from "react";
import { View, ViewStyle } from "react-native";
import { ComputedSettings } from "./model/ComputedSettings";
import { EmptyCell } from "./model/EmptyCell";
import { EmptyCellState } from "./model/EmptyCellState";
import { Game } from "./model/Game";

interface Props {
  emptyCell: EmptyCell;
}

export const EmptyCellView = observer((props: Props) => {
  const status: EmptyCellState = (() => {
    if (props.emptyCell.droppableCards.length === 0) {
      return "blocked";
    }

    if (Game.instance.draggingFromCell === undefined) {
      return "dropAllowedButNoCardIsBeingDragged";
    }

    // Don't have to take account of the cell currently being dragged from because this cell isn't considered empty until.
    if (Game.instance.mostOverlappedDroppableCell === props.emptyCell.cell) {
      return "mostOverlappedTargetableCell";
    }

    if (
      props.emptyCell.droppableCards.some((card) => {
        if (Game.instance.draggingFromCell === undefined) {
          return false;
        }
        return card === Game.instance.draggedCard;
      })
    ) {
      return "targetableCellButNotMostOverlapped";
    }

    return "dropAllowedButNotTargetableCell";
  })();

  const getBorderColorStyleAndWidth = (): [
    string | undefined,
    "solid" | "dotted" | "dashed" | undefined,
    number,
  ] => {
    switch (status) {
      case "blocked":
        return [undefined, undefined, 0];

      case "targetableCellButNotMostOverlapped":
        return ["white", "dashed", ComputedSettings.instance.borderWidth];

      case "dropAllowedButNoCardIsBeingDragged":
      case "dropAllowedButNotTargetableCell":
        return ["black", "dashed", ComputedSettings.instance.borderWidth];

      case "mostOverlappedTargetableCell":
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
