import * as React from 'react'
import { Component } from 'react'
import { observer } from 'mobx-react'
import { View } from 'react-native'
import { ViewStyle } from 'react-native'

import { Settings } from './Settings'
import { PositionedCardView } from './PositionedCardView'
import { Game } from './Game'
import { EmptyCellView } from './EmptyCellView'

@observer
export class GridView extends Component {
  public render() {
    const gridViewStyle: ViewStyle = {
      height: Settings.instance.gridSize.height,
      position: 'relative',
      width: Settings.instance.gridSize.width
    }

    return (
      <View style={gridViewStyle}>
        {Game.instance.currentGridState.positionedCards.map(positionedCard =>
          <PositionedCardView
            key={positionedCard.card.key}
            positionedCard={positionedCard}
          />
        )}
        {Game.instance.currentGridState.emptyCells.map(emptyCell =>
          <EmptyCellView
            emptyCell={emptyCell}
            key={emptyCell.cell.key}
          />
        )}
      </View>
    )
  }
}