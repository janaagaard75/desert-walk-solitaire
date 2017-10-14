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
            key={occupiedCell.card.key}
            occupiedCell={occupiedCell}
          />,
        )}
        {Game.instance.currentGridState.emptyCells.map(emptyCell =>
          <EmptyCellView
            emptyCell={emptyCell}
            key={emptyCell.cell.key}
          />,
        )}
      </View>
    )
  }
}