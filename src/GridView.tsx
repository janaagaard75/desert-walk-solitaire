import * as React from 'react'
import { Component } from 'react'
import { observer } from 'mobx-react'
import { View } from 'react-native'
import { ViewStyle } from 'react-native'

import { DraggableCardView } from './DraggableCardView'
import { EmptyCellView } from './EmptyCellView'
import { Game } from './Game'
import { Settings } from './Settings'

@observer
export class GridView extends Component {
  public render() {
    const gridViewStyle: ViewStyle = {
      height: Settings.instance.gridSize.height,
      position: 'relative',
      width: Settings.instance.gridSize.width,
    }

    return (
      <View
        style={gridViewStyle}
      >
        {Game.instance.currentGridState.occupiedCells.map(occupiedCell =>
          <DraggableCardView
            card={occupiedCell.card}
            correctlyPlaced={occupiedCell.correctlyPlaced}
            draggable={Game.instance.currentGridState.draggableCards.some(card => card === occupiedCell.card)}
            key={occupiedCell.card.key}
            onCardDragged={cardRectangle => Game.instance.cardDragged(cardRectangle)}
            onCardDragStarted={() => Game.instance.cardDragStarted(occupiedCell, occupiedCell.boundary)}
            onCardDropped={() => Game.instance.cardDropped(occupiedCell.cell)}
            startPosition={occupiedCell.position}
          />,
        )}
        {Game.instance.currentGridState.emptyCells.map(emptyCell =>
          <EmptyCellView
            key={emptyCell.cell.key}
            emptyCell={emptyCell}
          />,
        )}
      </View>
    )
  }
}