import * as React from 'react'
import { Component } from 'react'
import { StyleSheet } from 'react-native'
import { Text } from 'react-native'
import { View } from 'react-native'

import { Circle } from './Circle'
import { Draggable } from './Draggable'

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
        <Text>2 + 2 = {this.sum(2, 2)}</Text>
        <Circle
          color={'#ffb'}
          size={40}
        />
        <Draggable
          position={
            {
              left: 50,
              top: 80
            }
          }
        >
          <Circle
            color={'#f88'}
            size={30}
          />
        </Draggable>
      </View>
    )
  }

  private sum(a: number, b: number) {
    return a + b
  }
}