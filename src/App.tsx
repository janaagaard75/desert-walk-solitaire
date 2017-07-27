import * as React from 'react'
import { Component } from 'react'
import { LayoutChangeEvent } from 'react-native'
import { observer } from 'mobx-react'
import { StatusBar } from 'react-native'
import { Text } from 'react-native'
import { TextStyle } from 'react-native'
import { View } from 'react-native'
import { ViewStyle } from 'react-native'

import { Cell } from './Cell'
import { CellView } from './CellView'
import { Grid } from './Grid'
import { Position } from './Position'

@observer
export default class App extends Component<{}, {}> {
  private grid = new Grid()
  private gridHeight: number
  private gridWidth: number

  public render() {
    const mainViewStyle: ViewStyle = {
      backgroundColor: '#3b3',
      flex: 1,
      flexDirection: 'column'
    }

    const gridViewStyle: ViewStyle = {
      flex: 1,
      position: 'relative'
    }

    return (
      <View style={mainViewStyle}>
        <StatusBar hidden={true}/>
        <Text>
          Desert Walk
        </Text>
        <View
          onLayout={layoutChangeEvent => this.handleLayout(layoutChangeEvent)}
          style={gridViewStyle}
        >
          {this.grid.cells.map(cell =>
            <CellView
              cardSize={this.grid.cardSize}
              cell={cell}
              handleCardDropped={(fromCell, center) => this.handleCardDropped(fromCell, center)}
              key={cell.key}
            />
          )}
        </View>
      </View>
    )
  }

  private handleCardDropped(fromCell: Cell, center: Position) {
    this.grid.emptyCells.forEach(cell => {
      if (cell.boundary.pointIsWithinBoundary(center)) {
        this.grid.moveCard(fromCell, cell)
      }
    })
  }

  private handleLayout(layoutChangeEvent: LayoutChangeEvent) {
    this.gridHeight = layoutChangeEvent.nativeEvent.layout.height
    this.gridWidth = layoutChangeEvent.nativeEvent.layout.width
  }
}