import * as React from 'react'
import { Component } from 'react'
import { Dimensions } from 'react-native'
import { Image } from 'react-native'
import { observer } from 'mobx-react'
import { ScaledSize } from 'react-native'
import { ScreenOrientation } from 'expo'
import { StatusBar } from 'react-native'
import { Text } from 'react-native'
import { TextStyle } from 'react-native'
import { View } from 'react-native'
import { ViewStyle } from 'react-native'

import { Footer } from './Footer'
import { Grid } from './Grid'
import { GridView } from './GridView'
import { Settings } from './Settings'

interface AppState {
  windowSize: ScaledSize
}

@observer
export default class App extends Component<{}, AppState> {
  constructor(props: {}, context?: any) {
    super(props, context)

    ScreenOrientation.allow(ScreenOrientation.Orientation.ALL)

    this.state = {
      windowSize: Dimensions.get('window')
    }

    this.settings = new Settings(this.state.windowSize.width)
    this.grid = new Grid(this.settings)

    Dimensions.addEventListener('change', () => {
      this.setState({
        windowSize: Dimensions.get('window')
      })
      this.settings.availableWidth = this.state.windowSize.width
    })
  }

  private grid: Grid
  private settings: Settings

  public render() {
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
          source={require('./50713.png')}
          style={{
            height: this.state.windowSize.height,
            position: 'absolute',
            resizeMode: 'repeat',
            width: this.state.windowSize.width
          }}
        />
        <Text style={headerStyle}>
          Desert Walk
        </Text>
        <View
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

  private renderGrid() {
    if (this.settings === undefined) {
      return undefined
    }

    return (
      <GridView
        grid={this.grid}
        settings={this.settings}
      />
    )
  }
}