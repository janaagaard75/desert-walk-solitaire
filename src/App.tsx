import * as React from 'react'
import { Component } from 'react'
import { LayoutChangeEvent } from 'react-native'
import { Text } from 'react-native'
import { View } from 'react-native'
import { ViewStyle } from 'react-native'

import { CardModel } from './Card'
import { DraggableCard } from './DraggableCard'
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
        if (j === 0) {
          continue
        }
        this.grid[i][j] = this.deck[(this.columns - 1) * i + (j - 1)]
      }
    }
  }

  private cardHeight = 60
  private cardWidth = 40
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

    const gridViewStyle: ViewStyle = {
      flex: 1,
      position: 'relative'
    }

    return (
      <View style={mainViewStyle}>
        <Text>Desert Walk</Text>
        <View
          onLayout={layoutChangeEvent => this.handleLayout(layoutChangeEvent)}
          style={gridViewStyle}
        >
          {this.grid.map((row, rowIndex) =>
            row.map((cell, columnIndex) =>
              cell === undefined ? (
                <View/>
              ) : (
                <DraggableCard
                  height={this.cardHeight}
                  key={cell.key}
                  startPositionX={10 + columnIndex * (this.cardWidth + 5)}
                  startPositionY={10 + rowIndex * (this.cardHeight + 5)}
                  suit={cell.suit}
                  value={cell.value}
                  width={this.cardWidth}
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