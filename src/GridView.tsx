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
        {Game.instance.currentGridState.occupiedCells.map(pair =>
          <DraggableCardView
            card={pair.card}
            correctlyPlaced={pair.correctlyPlaced}
            draggable={Game.instance.currentGridState.draggableCards.some(card => card === pair.card)}
            key={pair.card.key}
            onCardDragged={cardRectangle => Game.instance.cardDragged(pair.card, cardRectangle)}
            onCardDragStarted={() => Game.instance.cardDragStarted(pair.card, pair.boundary)}
            onCardDropped={() => Game.instance.cardDropped(pair.cell)}
            startPosition={pair.position}
          />,
        )}
        {Game.instance.currentGridState.emptyCells.map(emptyCell =>
          <EmptyCellView
            key={emptyCell.cell.key}
            emptyCell={emptyCell}
            status={emptyCell.getStatus(Game.instance.draggedCard)}
          />,
        )}
      </View>
    )
  }
}