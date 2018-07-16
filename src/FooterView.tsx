import * as React from 'react'
import { Button, TouchableOpacity } from 'react-native'
import { Component } from 'react'
// tslint:disable-next-line:no-implicit-dependencies
import { FontAwesome, Entypo } from '@expo/vector-icons'
import { Modal } from 'react-native'
import { observer } from 'mobx-react'
import { Text } from 'react-native'
import { TextStyle } from 'react-native'
import { View } from 'react-native'

import { Game } from './Game'
import { GameState } from './GameState'
import { Settings } from './Settings'

interface State {
  confirmModalVisible: boolean
}

enum TouchableState {
  Disabled,
  Enabled,
  Hidden
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

    return (
      <View
        style={{
          backgroundColor: Settings.instance.colors.mainBackgroundColor,
          paddingTop: 4
        }}
      >
        <View
          style={{
            backgroundColor: Settings.instance.colors.mainBackgroundColor,
            flexDirection: 'row',
            flexWrap: 'wrap'
          }}
        >
          {this.renderButton('Restart', () => this.confirmUnlessGameOver(), true)}
          {this.renderIcon('entypo', 'controller-fast-forward', () => Game.instance.replay(), this.replayEnabled() ? TouchableState.Enabled : TouchableState.Hidden)}
          {this.renderIcon('entypo', 'shuffle', () => Game.instance.shuffleCardsInIncorrectPosition(), this.shuffleButtonEnabled(1))}
          {this.renderIcon('entypo', 'shuffle', () => Game.instance.shuffleCardsInIncorrectPosition(), this.shuffleButtonEnabled(2))}
          {this.renderIcon('entypo', 'shuffle', () => Game.instance.shuffleCardsInIncorrectPosition(), this.shuffleButtonEnabled(3))}
          {this.renderIcon('fontAwesome', 'undo', () => Game.instance.undo(), Game.instance.undoEnabled ? TouchableState.Enabled : TouchableState.Disabled)}
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

  private renderIcon(
    iconGroup: string,
    iconName: string,
    handlePress: () => void,
    state: TouchableState
  ) {
    const color = state === TouchableState.Enabled ? '#9ff' : '#999'

    return (
      <View
        style={{
          alignItems: 'center',
          alignSelf: 'center',
          backgroundColor: 'transparent',
          width: '16.666%'
        }}
      >
        {state === TouchableState.Hidden
          ?
            undefined
          :
            <TouchableOpacity
              onPress={handlePress}
              disabled={state === TouchableState.Disabled}
            >
             {this.renderIcon2(iconGroup, iconName, color)}
            </TouchableOpacity>
        }
      </View>
    )
  }

  private renderIcon2(
    iconGroup: string,
    iconName: string,
    color: string
  ) {
    const iconSize = 20

    switch (iconGroup){
      case 'entypo':
        return (
          <Entypo
            color={color}
            name={iconName}
            size={iconSize}
          />
        )

      case 'fontAwesome':
        return (
          <FontAwesome
            color={color}
            name={iconName}
            size={iconSize}
          />
        )

      default:
        throw new Error(`The iconGroup '${iconGroup} is not supported.`)
    }
  }

  private renderButton(title: string, handlePress: () => void, enabled: boolean) {
    return (
      <View
        style={{
          backgroundColor: 'transparent',
          width: '16.666%'
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

  // TODO: Make computed?
  private replayEnabled(): boolean {
    const enabled = Game.instance.gameStatus === GameState.GameWon
    return enabled
  }

  private showConfirmModal() {
    this.setState({
      confirmModalVisible: true
    })
  }

  private shuffleButtonEnabled(buttonNumber: number): TouchableState {
    const buttonNumberToEnable = Game.instance.shuffles + 1

    if (buttonNumber < buttonNumberToEnable) {
      return TouchableState.Hidden
    }

    if (buttonNumber === buttonNumberToEnable
      && Game.instance.gameStatus === GameState.Stuck) {
      return TouchableState.Enabled
    }

    return TouchableState.Disabled
  }

  private startOver() {
    this.hideConfirmModal()
    Game.instance.startOver()
  }
}