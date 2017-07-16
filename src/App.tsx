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

    for (let i = 0; i < 4; i++) {
      this.grid[i] = []
      for (let j = 0; j < 13; j++) {
        this.grid[i][j] = this.deck[13 * i + j]
      }
    }
  }

  private deck: Array<Card> = []
  private grid: Array<Array<Card>> = []

  private rowStyle: ViewStyle = {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-around'
  }

  private columnStyle: ViewStyle = {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around'
  }

  private mainViewStyle: ViewStyle = {
    backgroundColor: '#3b3',
    flex: 1,
    flexDirection: 'column'
  }

  public render() {
    return (
      <View style={this.mainViewStyle}>
        <Text>Desert Walk</Text>
        <View style={this.rowStyle}>
          {this.grid.map((rows, index) =>
            <View style={this.columnStyle} key={index}>
              {rows.map(cell =>
                <DraggableCard2
                  key={cell.key}
                  suit={cell.suit}
                  value={cell.value}
                />
              )}
            </View>
          )}
        </View>
      </View>
    )
  }
}