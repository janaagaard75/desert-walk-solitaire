import * as React from 'react'
import { Component } from 'react'
import { LayoutChangeEvent } from 'react-native'
import { observer } from 'mobx-react'
import { Text } from 'react-native'
import { TextStyle } from 'react-native'
import { View } from 'react-native'
import { ViewStyle } from 'react-native'

import { Boundary } from './Boundary'
import { Cell } from './Cell'
import { DraggableCard } from './DraggableCard'
import { EmptyCell } from './EmptyCell'
import { Position } from './Position'
import { Grid } from './Grid'

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

    const headerStyle: TextStyle = {
      paddingTop: 25
    }

    const gridViewStyle: ViewStyle = {
      flex: 1,
      position: 'relative'
    }

    return (
      <View style={mainViewStyle}>
        <Text
          style={headerStyle}
        >
          Desert Walk
        </Text>
        <View
          onLayout={layoutChangeEvent => this.handleLayout(layoutChangeEvent)}
          style={gridViewStyle}
        >
          {this.grid.cells.map(cell =>
            this.renderCell(cell)
          )}
        </View>
      </View>
    )
  }

  private renderCell(cell: Cell) {
    // Using === undefined instead of isEmpty to avoid compiler error.
    if (cell.card === undefined) {
      return (
        <EmptyCell
          isHovered={false}
          key={cell.key}
          position={cell.position}
          size={this.grid.cardSize}
        />
      )
    }
    else {
      return (
        <DraggableCard
          card={cell.card}
          isDraggable={cell.cardIsDraggable}
          key={cell.key}
          onCardDropped={center => this.handleCardDropped(cell, center)}
          startPosition={cell.position}
          size={this.grid.cardSize}
        />
      )
    }
  }

  private handleCardDropped(fromCell: Cell, center: Position) {
    this.grid.emptyCells.forEach(cell => {
      if (this.pointIsWithinBoundary(center, cell.boundary)) {
        // tslint:disable-next-line:no-console
        console.info(`Card dropped on empty cell #${cell.key}.`)
        this.grid.moveCard(fromCell, cell)
        this.forceUpdate()
      }
    })
  }

  private pointIsWithinBoundary(point: Position, boundary: Boundary): boolean {
    const within
      = point.left >= boundary.topLeft.left
        && point.left <= boundary.bottomRight.left
        && point.top >= boundary.topLeft.top
        && point.top <= boundary.bottomRight.top

    return within
  }

  private handleLayout(layoutChangeEvent: LayoutChangeEvent) {
    this.gridHeight = layoutChangeEvent.nativeEvent.layout.height
    this.gridWidth = layoutChangeEvent.nativeEvent.layout.width
  }
}