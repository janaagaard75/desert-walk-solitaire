import { observer } from "mobx-react"
import React from "react"
import { View, ViewStyle } from "react-native"
import { EmptyCellView } from "./EmptyCellView"
import { ComputedSettings } from "./model/ComputedSettings"
import { Game } from "./model/Game"
import { PositionedCardView } from "./PositionedCardView"

export const GridView = observer(() => {
  const gridViewStyle: ViewStyle = {
    height: ComputedSettings.instance.gridSize.height,
    position: "relative",
    width: ComputedSettings.instance.gridSize.width,
  }

  return (
    <View style={gridViewStyle}>
      {Game.instance.currentGridState.positionedCards.map((positionedCard) => (
        <PositionedCardView
          key={positionedCard.card.key}
          cardSize={ComputedSettings.instance.cardSize}
          positionedCard={positionedCard}
        />
      ))}
      {Game.instance.currentGridState.emptyCells.map((emptyCell) => (
        <EmptyCellView emptyCell={emptyCell} key={emptyCell.cell.key} />
      ))}
    </View>
  )
})
