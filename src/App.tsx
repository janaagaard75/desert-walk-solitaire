import * as React from 'react'
import { Component } from 'react'
import { LayoutChangeEvent } from 'react-native'
import { Text } from 'react-native'
import { TextStyle } from 'react-native'
import { View } from 'react-native'
import { ViewStyle } from 'react-native'

import { CardModel } from './CardModel'
import { Cell } from './Cell'
import { CellStatus } from './CellStatus'
import { DraggableCard } from './DraggableCard'
import { EmptyCell } from './EmptyCell'
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
      this.grid[r] = []
      for (let c = 0; c < this.columns; c++) {
        if (c === 0) {
          this.grid[r][c] = new Cell(r, c, undefined)
        }
        else {
          this.grid[r][c] = new Cell(r, c, this.grid[r][c - 1])
          this.grid[r][c].card = this.deck[(this.columns - 1) * r + (c - 1)]
        }
      }
    }
  }

  private cardSize: Size = {
    height: 60,
    width: 40
  }
  private columns = 14
  private deck: Array<CardModel> = []
  private grid: Array<Array<Cell>> = []
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
          {this.grid.map(row =>
            row.map(cell =>
              this.renderCell(cell)
            )
          )}
        </View>
      </View>
    )
  }

  private renderCell(cell: Cell) {
    const position = {
      left: 10 + cell.columnIndex * (this.cardSize.width + 5),
      top: 10 + cell.rowIndex * (this.cardSize.height + 5)
    }

    switch (cell.status) {
      case CellStatus.EmptyAndDropPossible:
        return (
          <EmptyCell
            key={cell.key}
            position={position}
            size={this.cardSize}
          />
        )

      case CellStatus.OccupiedByDraggableCardInWrongPlace:
        return (
          <DraggableCard
            card={cell.card as CardModel}
            key={cell.key}
            startPosition={position}
            size={this.cardSize}
          />
        )

      default:
        throw new Error(`cell.status '${cell.status}' is not supported.`)
    }
  }

  private handleLayout(layoutChangeEvent: LayoutChangeEvent) {
    this.gridHeight = layoutChangeEvent.nativeEvent.layout.height
    this.gridWidth = layoutChangeEvent.nativeEvent.layout.width
  }
}