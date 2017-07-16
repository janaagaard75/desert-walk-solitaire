import * as React from 'react'
import { Component } from 'react'
import { Text } from 'react-native'
import { View } from 'react-native'
import { ViewStyle } from 'react-native'

import { Card } from './Card'
import { Draggable } from './Draggable'
import { Suit } from './Suit'

export default class App extends Component<{}, void> {
  constructor(props: {}, context?: any) {
    super(props, context)
  }

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
          {Array.from(Array(13).keys()).map((_, index) =>
            <Draggable>
              <Card
                suit={Suit.Spades}
                value={index + 1}
              />
            </Draggable>
          )}
        </View>
      </View>
    )
  }
}