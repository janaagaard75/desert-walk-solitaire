import * as React from 'react'
import { Button, TouchableOpacity } from 'react-native'
import { Component } from 'react'
// tslint:disable-next-line:no-implicit-dependencies
import { Entypo } from '@expo/vector-icons'
import { Modal } from 'react-native'
import { observer } from 'mobx-react'
import { Text } from 'react-native'
import { TextStyle } from 'react-native'
import { View } from 'react-native'

import { Game } from './Game'
import { GameState } from './GameState'
import { ScreenOrientation } from './ScreenOrientation'
import { Settings } from './Settings'

interface State {
  confirmModalVisible: boolean
}

@observer
export class FooterView extends Component<{}, State> {
  constructor(props: {}, context?: any) {
    super(props, context)

    this.state = {
      confirmModalVisible: false
    }
  }

  public render() {
    const questionStyle: TextStyle = {
      fontSize: 24,
      marginBottom: 10,
      textAlign: 'center'
    }

    const textStyle: TextStyle = {
      backgroundColor: 'transparent',
      color: 'white',
      flex: 1,
      fontWeight: '700'
    }

    const rightAlignedTextStyle: TextStyle = {
      ...textStyle, ...{
        textAlign: 'right'
      }
    }

    return (
      <View
        style={{
          backgroundColor: Settings.instance.colors.mainBackgroundColor,
          paddingTop: 4
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            marginLeft: 10,
            marginRight: 10
          }}
        >
          <Text style={textStyle}>
            Moves: {Game.instance.numberOfMoveTurns}
          </Text>
          <Text style={rightAlignedTextStyle}>
            Shuffles: {Game.instance.shuffles}
          </Text>
        </View>
        <View
          style={{
            backgroundColor: Settings.instance.colors.mainBackgroundColor,
            flexDirection: 'row',
            flexWrap: 'wrap'
          }}
        >
          {this.renderButton('Restart', () => this.confirmUnlessGameOver(), true)}
          {this.renderButton('Replay', () => Game.instance.replay(), this.replayEnabled())}
          {this.renderIcon('shuffle', () => Game.instance.shuffleCardsInIncorrectPosition(), this.shuffleButtonEnabled(1))}
          {this.renderIcon('shuffle', () => Game.instance.shuffleCardsInIncorrectPosition(), this.shuffleButtonEnabled(2))}
          {this.renderIcon('shuffle', () => Game.instance.shuffleCardsInIncorrectPosition(), this.shuffleButtonEnabled(3))}
          {this.renderButton('Undo', () => Game.instance.undo(), Game.instance.undoEnabled)}
        </View>
        <Modal
          animationType="slide"
          supportedOrientations={['landscape']}
          transparent={false}
          visible={this.state.confirmModalVisible}
        >
          <View style={{ marginTop: 22 }}>
            <Text style={questionStyle}>
              This game isn't over yet. Start over anyway?
            </Text>
            <Button
              onPress={() => this.startOver()}
              title="Yes, start over"
            />
            <Button
              onPress={() => this.hideConfirmModal()}
              title="No, let me continue this game"
            />
          </View>
        </Modal>
      </View>
    )
  }

  private renderIcon(name: 'shuffle', handlePress: () => void, enabled: boolean) {
    const color = enabled ? '#99f' : '#ccc'

    return (
      <View
        style={{
          alignItems: 'center',
          alignSelf: 'center',
          backgroundColor: 'transparent',
          width: Settings.instance.screenOrientation === ScreenOrientation.Portrait
            ? '50%'
            : '16.666%'
        }}
      >
        <TouchableOpacity
          onPress={handlePress}
          disabled={!enabled}
        >
          <Entypo
            color={color}
            name={name}
            size={20}
          />
        </TouchableOpacity>
      </View>
    )
  }

  private renderButton(title: string, handlePress: () => void, enabled: boolean) {
    return (
      <View
        style={{
          backgroundColor: 'transparent',
          width: Settings.instance.screenOrientation === ScreenOrientation.Portrait
            ? '50%'
            : '16.666%'
        }}
      >
        <Button
          onPress={handlePress}
          disabled={!enabled}
          title={title}
        />
      </View>
    )
  }

  private confirmUnlessGameOver() {
    switch (Game.instance.gameStatus) {
      case GameState.GameLost:
      case GameState.GameWon:
        Game.instance.startOver()
        break

      case GameState.MovePossible:
      case GameState.Stuck:
        this.showConfirmModal()
        break

      default:
        throw new Error(`GameStatus ${Game.instance.gameStatus} is not supported.`)
    }
  }

  private hideConfirmModal() {
    this.setState({
      confirmModalVisible: false
    })
  }

  private replayEnabled(): boolean {
    const enabled = Game.instance.gameStatus === GameState.GameWon
    return enabled
  }

  private showConfirmModal() {
    this.setState({
      confirmModalVisible: true
    })
  }

  private shuffleButtonEnabled(buttonNumber: number): boolean {
    if (Game.instance.gameStatus !== GameState.Stuck) {
      return false
    }

    const enabledButtonNumber = Game.instance.shuffles + 1

    if (enabledButtonNumber > Settings.instance.numberOfShuffles) {
      return false
    }

    const enabled = buttonNumber === enabledButtonNumber
    return enabled
  }

  private startOver() {
    this.hideConfirmModal()
    Game.instance.startOver()
  }
}