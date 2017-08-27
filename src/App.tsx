import * as React from 'react'
import { Component } from 'react'
import { Dimensions } from 'react-native'
import { Image } from 'react-native'
import { LayoutChangeEvent } from 'react-native'
import { observable } from 'mobx'
import { observer } from 'mobx-react'
import { StatusBar } from 'react-native'
import { Text } from 'react-native'
import { TextStyle } from 'react-native'
import { View } from 'react-native'
import { ViewStyle } from 'react-native'

import { Footer } from './Footer'
import { Grid } from './Grid'
import { GridView } from './GridView'
import { Size } from './Size'

@observer
export default class App extends Component<{}, {}> {
  @observable private availableSize: Size | undefined = undefined
  private grid = new Grid()

  public render() {
    const windowSize = Dimensions.get('window')

    const headerStyle: TextStyle = {
      backgroundColor: 'transparent',
      fontWeight: '600',
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
        <Image
          source={require('./111699.png')}
          style={{
            height: windowSize.height,
            position: 'absolute',
            resizeMode: 'repeat',
            width: windowSize.width
          }}
        />
        <Text style={headerStyle}>
          Desert Walk
        </Text>
        <View
          onLayout={layoutChangeEvent => this.layoutChanged(layoutChangeEvent)}
          style={gridWrapperViewStyle}
        >
          {this.renderGrid()}
        </View>
        <Footer
          cardsInCorrectPlace={this.grid.cardsInCorrectPlace}
          gameStatus={this.grid.gameStatus}
          moves={this.grid.moves}
          shuffleCardsInWrongPlace={() => this.grid.shuffleCardsInWrongPlace()}
          startOver={() => this.grid.startOver()}
          shuffles={this.grid.shuffles}
        />
      </View>
    )
  }

  private layoutChanged(layoutChangeEvent: LayoutChangeEvent) {
    this.availableSize = {
      height: layoutChangeEvent.nativeEvent.layout.height,
      width: layoutChangeEvent.nativeEvent.layout.width
    }
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
}