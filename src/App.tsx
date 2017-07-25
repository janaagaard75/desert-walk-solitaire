import * as React from 'react'
import { Component } from 'react'
import { LayoutChangeEvent } from 'react-native'
import { Text } from 'react-native'
import { TextStyle } from 'react-native'
import { View } from 'react-native'
import { ViewStyle } from 'react-native'

import { CardModel } from './CardModel'
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

    for (let i = 0; i < this.rows; i++) {
      this.grid[i] = []
      for (let j = 0; j < this.columns; j++) {
        this.grid[i][j] = (j === 0)
          ? undefined
          : this.grid[i][j] = this.deck[(this.columns - 1) * i + (j - 1)]
      }
    }
  }

  private cardSize: Size = {
    height: 60,
    width: 40
  }
  private columns = 14
  private deck: Array<CardModel> = []
  private grid: Array<Array<CardModel | undefined>> = []
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
          {this.grid.map((row, rowIndex) =>
            row.map((cell, columnIndex) =>
              cell === undefined ? (
                <EmptyCell
                  key={columnIndex}
                  position={{
                    left: 10 + columnIndex * (this.cardSize.width + 5),
                    top: 10 + rowIndex * (this.cardSize.height + 5)
                  }}
                  size={this.cardSize}
                />
              ) : (
                <DraggableCard
                  card={cell}
                  key={cell.key}
                  startPosition={{
                    left: 10 + columnIndex * (this.cardSize.width + 5),
                    top: 10 + rowIndex * (this.cardSize.height + 5)
                  }}
                  size={this.cardSize}
                />
              )
            )
          )}
        </View>
      </View>
    )
  }

  private handleLayout(layoutChangeEvent: LayoutChangeEvent) {
    this.gridHeight = layoutChangeEvent.nativeEvent.layout.height
    this.gridWidth = layoutChangeEvent.nativeEvent.layout.width
  }
}