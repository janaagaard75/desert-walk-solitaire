import * as React from 'react'
import { Button } from 'react-native'
import { Component } from 'react'
import { LayoutChangeEvent } from 'react-native'
import { observable } from 'mobx'
import { observer } from 'mobx-react'
import { StatusBar } from 'react-native'
import { Text } from 'react-native'
import { TextStyle } from 'react-native'
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
    const headerStyle: TextStyle = {
      marginTop: 4,
      textAlign: 'center'
    }

    const mainViewStyle: ViewStyle = {
      backgroundColor: '#bbb',
      flex: 1,
      flexDirection: 'column'
    }

    const gridWrapperViewStyle: ViewStyle = {
      flex: 1
    }

    return (
      <View style={mainViewStyle}>
        <StatusBar hidden={true}/>
        <Text style={headerStyle}>
          Desert Walk
        </Text>
        <View
          onLayout={layoutChangeEvent => this.handleLayout(layoutChangeEvent)}
          style={gridWrapperViewStyle}
        >
          {this.renderGrid()}
        </View>
        <View>
          <Button
            onPress={() => this.handleResetPress()}
            title="Start Over"
          />
        </View>
      </View>
    )
  }

  private handleResetPress() {
    this.grid.shuffleDeckAndDealCards()
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