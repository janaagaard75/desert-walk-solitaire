import * as React from 'react'
import { Component } from 'react'
import { StyleSheet } from 'react-native'
import { Text } from 'react-native'
import { View } from 'react-native'

import { Card } from './Card'
import { Draggable } from './Draggable'
import { Suit } from './Suit'

export default class App extends Component<{}, void> {
  private styles = StyleSheet.create({
    container: {
      alignItems: 'center',
      backgroundColor: '#3b3',
      flex: 1,
      justifyContent: 'center'
    }
  })

  public render() {
    return (
      <View style={this.styles.container}>
        <Text>Open up App.js to start working on your app!</Text>
        <Draggable
          startPosition={
            {
              left: 50,
              top: 80
            }
          }
        >
          <Card
            suit={Suit.Spades}
            value={10}
          />
        </Draggable>
      </View>
    )
  }
}