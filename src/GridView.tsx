import { observer } from "mobx-react"
import * as React from "react"
import { Component } from "react"
import { View, ViewStyle } from "react-native"
import { EmptyCellView } from "./EmptyCellView"
import { Card } from "./model/Card"
import { ComputedSettings } from "./model/ComputedSettings"
import { Game } from "./model/Game"
import { PositionedCardView } from "./PositionedCardView"

@observer
export class GridView extends Component {
  public render() {
    const gridViewStyle: ViewStyle = {
      height: ComputedSettings.instance.gridSize.height,
      position: "relative",
      width: ComputedSettings.instance.gridSize.width
    }

    return (
      <View style={gridViewStyle}>
        {Game.instance.currentGridState.positionedCards.map(positionedCard => (
          <PositionedCardView
            key={positionedCard.card.key}
            cardSize={ComputedSettings.instance.cardSize}
            draggable={this.isDraggable(positionedCard.card)}
            positionedCard={positionedCard}
          />
        ))}
        {Game.instance.currentGridState.emptyCells.map(emptyCell => (
          <EmptyCellView emptyCell={emptyCell} key={emptyCell.cell.key} />
        ))}
      </View>
    )
  }

  private isDraggable(card: Card): boolean {
    const draggable = Game.instance.currentGridState.draggableCards.includes(
      card
    )
    return draggable
  }
}
