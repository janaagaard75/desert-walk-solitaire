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
import { Game } from './Game'
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
    Settings.instance.availableWidth = this.state.windowSize.width

    this.game = new Game()

    Dimensions.addEventListener('change', () => {
      this.setState({
        windowSize: Dimensions.get('window')
      })
      Settings.instance.availableWidth = this.state.windowSize.width
    })
  }

  private game: Game

  public render() {
    const headerStyle: TextStyle = {
      backgroundColor: Settings.instance.colors.mainBackgroundColor,
      color: 'white',
      fontWeight: '600',
      paddingBottom: 4,
      paddingTop: 4,
      textAlign: 'center',
      zIndex: 10 // TODO: Figure out why this is necessary.
    }

    const mainViewStyle: ViewStyle = {
      backgroundColor: Settings.instance.colors.mainBackgroundColor,
      flex: 1,
      flexDirection: 'column'
    }

    const gridWrapperViewStyle: ViewStyle = {
      alignItems: 'center',
      flex: 1,
      justifyContent: 'center'
    }

    return (
      <View style={mainViewStyle}>
        <StatusBar hidden={true}/>
        <Text style={headerStyle}>
          Desert Walk
        </Text>
        <View style={gridWrapperViewStyle}>
          <Image
            source={require('./50713-transparent.png')}
            style={{
              backgroundColor: Settings.instance.colors.gridBackgroundColor,
              height: this.state.windowSize.height,
              position: 'absolute',
              resizeMode: 'repeat',
              width: this.state.windowSize.width
            }}
          />
          <GridView
            turnState={this.game.currentTurnState}
            onMoveCard={(from, to) => this.game.moveCard(from, to)}
          />
        </View>
        <Footer
          correctlyPlacedCards={this.game.currentTurnState.correctlyPositionedCards.length}
          gameStatus={this.game.gameStatus}
          moves={this.game.moves}
          shuffleCardsInWrongPlace={() => this.game.shuffleCardsInWrongPlace()}
          startOver={() => this.game.startOver()}
          shuffles={this.game.shuffles}
        />
      </View>
    )
  }
}