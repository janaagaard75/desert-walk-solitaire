import * as React from 'react'
import { Button } from 'react-native'
import { Component } from 'react'
import { Modal } from 'react-native'
import { observer } from 'mobx-react'
import { Slider } from 'react-native'
import { Text } from 'react-native'
import { TextStyle } from 'react-native'
import { TouchableOpacity } from 'react-native'
import { View } from 'react-native'

// tslint:disable:no-implicit-dependencies
import { Entypo } from '@expo/vector-icons'
import { FontAwesome } from '@expo/vector-icons'
// tslint:enable:no-implicit-dependencies

import { Game } from './model/Game'
import { GameState } from './model/GameState'
import { Settings } from './model/Settings'
import { TouchableState } from './model/TouchableState'

interface State {
  confirmModalVisible: boolean
  value: number
}

@observer
export class FooterView extends Component<{}, State> {
  constructor(props: {}, context?: any) {
    super(props, context)

    this.state = {
      confirmModalVisible: false,
      value: 5
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
          paddingBottom: 14, // TODO: Remove the need for this value. Tweaked manually to make it fit.
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
          {this.renderIconWithTouch('fontAwesome', 'fast-backward', () => this.confirmUnlessGameOver(), TouchableState.Enabled)}
          {/* {this.renderIconWithTouch('entypo', 'controller-fast-forward', () => Game.instance.replay(), Game.instance.replayEnabled ? TouchableState.Enabled : TouchableState.Hidden)}
          {this.renderIconWithTouch('entypo', 'shuffle', () => Game.instance.shuffleCardsInIncorrectPosition(), this.shuffleButtonEnabled(1))}
          {this.renderIconWithTouch('entypo', 'shuffle', () => Game.instance.shuffleCardsInIncorrectPosition(), this.shuffleButtonEnabled(2))}
          {this.renderIconWithTouch('entypo', 'shuffle', () => Game.instance.shuffleCardsInIncorrectPosition(), this.shuffleButtonEnabled(3))}
          {this.renderIconWithTouch('fontAwesome', 'step-backward', () => Game.instance.undo(), Game.instance.undoState)} */}
          <View
            style={{
              width: `${5 / 7 * 100}%`
            }}
          >
            <Slider
              step={1}
              minimumValue={5}
              maximumValue={13}
              onValueChange={newValue => this.change(newValue)}
              value={this.state.value}
            />
          </View>
          {this.renderIconWithTouch('fontAwesome', 'step-forward', () => Game.instance.redo(), Game.instance.redoState)}
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

  private change(newValue: number) {
    this.setState({
      value: newValue
    })
  }

  private renderIconWithTouch(
    iconGroup: string,
    iconName: string,
    handlePress: () => void,
    state: TouchableState
  ) {
    const numberOfIcons = 7
    const width = 1 / numberOfIcons * 100

    if (state === TouchableState.Hidden) {
      return (
        <View style={{ width: `${width}%` }} />
      )
    }

    const color = state === TouchableState.Enabled ? '#fff' : '#999'
    const shadowOpacity = state === TouchableState.Enabled ? 0.5 : 0

    return (
      <TouchableOpacity
        onPress={handlePress}
        disabled={state === TouchableState.Disabled}
        style={{
          alignItems: 'center',
          alignSelf: 'center',
          backgroundColor: 'transparent',
          shadowColor: '#fff',
          shadowOpacity: shadowOpacity,
          shadowRadius: 5,
          width: `${width}%`
        }}
      >
        {this.renderIcon(iconGroup, iconName, color)}
      </TouchableOpacity>
    )
  }

  private renderIcon(
    iconGroup: string,
    iconName: string,
    color: string
  ) {
    const iconSize = 20

    switch (iconGroup) {
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

  private confirmUnlessGameOver() {
    switch (Game.instance.gameState) {
      case GameState.GameLost:
      case GameState.GameWon:
        Game.instance.startOver()
        break

      case GameState.MovePossible:
      case GameState.Stuck:
        this.showConfirmModal()
        break

      default:
        throw new Error(`Game state ${Game.instance.gameState} is not supported.`)
    }
  }

  private hideConfirmModal() {
    this.setState({
      confirmModalVisible: false
    })
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
      && Game.instance.gameState === GameState.Stuck) {
      return TouchableState.Enabled
    }

    return TouchableState.Disabled
  }

  private startOver() {
    this.hideConfirmModal()
    Game.instance.startOver()
  }
}