import * as React from 'react'
import { Component } from 'react'
import { Text } from 'react-native'
import { View } from 'react-native'
import { ViewStyle } from 'react-native'

import { Card } from './Card'
import { CardView } from './CardView'
import { Draggable } from './Draggable'
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
  }

  private deck: Array<Card> = []

  private gridStyles: ViewStyle = {
    flex: 1,
    flexDirection: 'row'
  }

  private mainViewStyles: ViewStyle = {
    backgroundColor: '#3b3',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-around'
  }

  public render() {
    return (
      <View style={this.mainViewStyles}>
        <Text>Desert Walk</Text>
        <View style={this.gridStyles}>
          {this.deck.map(card =>
            <Draggable key={card.key}>
              <CardView
                suit={card.suit}
                value={card.value}
              />
            </Draggable>
          )}
        </View>
      </View>
    )
  }
}