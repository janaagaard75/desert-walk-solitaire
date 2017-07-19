import * as React from 'react'
import { Component } from 'react'
import { Text } from 'react-native'
import { View } from 'react-native'
import { ViewStyle } from 'react-native'

import { Card } from './Card'
import { DraggableCard2 } from './DraggableCard2'
import { Suit } from './Suit'

export default class App extends Component<{}, void> {
  constructor(props: {}, context?: any) {
    super(props, context)

    for (const suit of [Suit.Clubs, Suit.Diamonds, Suit.Hearts, Suit.Spades]) {
      if (Suit.hasOwnProperty(suit)) {
        for (let i = 1; i <= 13; i++) {
          const card = new Card(suit, i)
          this.deck.push(card)
        }
      }
    }

    for (let i = 0; i < this.rows; i++) {
      this.grid[i] = []
      for (let j = 0; j < this.columns; j++) {
        this.grid[i][j] = this.deck[this.columns * i + j]
      }
    }
  }

  private columns = 13
  private deck: Array<Card> = []
  private grid: Array<Array<Card>> = []
  private rows = 4

  public render() {
    const mainViewStyle: ViewStyle = {
      backgroundColor: '#3b3',
      flex: 1,
      flexDirection: 'column'
    }

    const gridStyle: ViewStyle = {
      flex: 1,
      flexDirection: 'row',
      flexWrap: 'wrap',
      // height: this.rows * 60 + ((40 - 1) / (this.columns - 1) * (this.rows - 1)),
      justifyContent: 'space-between',
      width: this.columns * 40 + (40 - 1)
    }

    return (
      <View style={mainViewStyle}>
        <Text>Desert Walk</Text>
        <View style={gridStyle}>
          {this.grid.map(row =>
            row.map(cell =>
              <DraggableCard2
                key={cell.key}
                suit={cell.suit}
                value={cell.value}
              />
            )
          )}
        </View>
      </View>
    )
  }
}