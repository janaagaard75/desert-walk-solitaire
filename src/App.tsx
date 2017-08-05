import * as React from 'react'
import { Component } from 'react'
import { LayoutChangeEvent } from 'react-native'
import { observable } from 'mobx'
import { observer } from 'mobx-react'
import { StatusBar } from 'react-native'
import { Text } from 'react-native'
import { View } from 'react-native'
import { ViewStyle } from 'react-native'

import { Grid } from './Grid'
import { GridView } from './GridView'
import { Size } from './Size'

@observer
export default class App extends Component<{}, {}> {
  @observable private availableSize: Size | undefined = undefined
  private grid = new Grid()

  public render() {
    const mainViewStyle: ViewStyle = {
      backgroundColor: '#ccc',
      flex: 1,
      flexDirection: 'column'
    }

    const gridWrapperViewStyle: ViewStyle = {
      flex: 1
    }

    return (
      <View style={mainViewStyle}>
        <StatusBar hidden={true}/>
        <Text>
          Desert Walk
        </Text>
        <View
          onLayout={layoutChangeEvent => this.handleLayout(layoutChangeEvent)}
          style={gridWrapperViewStyle}
        >
          {this.renderGrid()}
        </View>
      </View>
    )
  }

  private renderGrid() {
    if (this.availableSize === undefined) {
      return undefined
    }

    return (
      <GridView
        availableSize={this.availableSize}
        grid={this.grid}
      />
    )
  }

  private handleLayout(layoutChangeEvent: LayoutChangeEvent) {
    this.availableSize = {
      height: layoutChangeEvent.nativeEvent.layout.height,
      width: layoutChangeEvent.nativeEvent.layout.width
    }
  }
}