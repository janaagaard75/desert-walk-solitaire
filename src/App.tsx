import * as React from 'react'
import { Component } from 'react'
import { LayoutChangeEvent } from 'react-native'
import { Text } from 'react-native'
import { TextStyle } from 'react-native'
import { View } from 'react-native'
import { ViewStyle } from 'react-native'

import { Boundary } from './Boundary'
import { CardModel } from './CardModel'
import { Cell } from './Cell'
import { DraggableCard } from './DraggableCard'
import { EmptyCell } from './EmptyCell'
import { Position } from './Position'
import { Size } from './Size'
import { Suit } from './Suit'

export default class App extends Component<{}, {}> {
  constructor(props: {}, context?: any) {
    super(props, context)

    for (const suit of [Suit.Clubs, Suit.Diamonds, Suit.Hearts, Suit.Spades]) {
      if (Suit.hasOwnProperty(suit)) {
        for (let i = 1; i <= 13; i++) {
          const card = new CardModel(suit, i)
          this.deck.push(card)
        }
      }
    }

    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.columns; c++) {
        let cell: Cell
        const position = {
          left: 10 + c * (this.cardSize.width + 5),
          top: 10 + r * (this.cardSize.height + 5)
        }

        if (c === 0) {
          cell = new Cell(r, c, position, this.cardSize, undefined)
        }
        else {
          cell = new Cell(r, c, position, this.cardSize, this.cells[this.cells.length])
          cell.card = this.deck[(this.columns - 1) * r + (c - 1)]
        }
        this.cells.push(cell)
      }
    }
  }

  private cardSize: Size = {
    height: 60,
    width: 40
  }
  private columns = 14
  private deck: Array<CardModel> = []
  private cells: Array<Cell> = []
  private gridHeight: number
  private gridWidth: number
  private rows = 4

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
          {this.cells.map(cell =>
            this.renderCell(cell)
          )}
        </View>
      </View>
    )
  }

  private renderCell(cell: Cell) {
    if (cell.card === undefined) {
      return (
        <EmptyCell
          isHovered={false}
          key={cell.key}
          position={cell.position}
          size={this.cardSize}
        />
      )
    }
    else {
      return (
        <DraggableCard
          card={cell.card}
          isDraggable={cell.cardIsDraggable}
          key={cell.key}
          onCardDropped={center => this.handleCardDropped(center)}
          startPosition={cell.position}
          size={this.cardSize}
        />
      )
    }
  }

  private handleCardDropped(center: Position) {
    this.cells.forEach(cell => {
      if (cell.card !== undefined) {
        return
      }

      if (this.pointIsWithinBoundary(center, cell.boundary)) {
        // tslint:disable-next-line:no-console
        console.info(`Card dropped on empty cell #${cell.key}.`)
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