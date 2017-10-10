import * as React from 'react'
import { Button } from 'react-native'
import { Component } from 'react'
import { Modal } from 'react-native'
import { observer } from 'mobx-react'
import { Text } from 'react-native'
import { TextStyle } from 'react-native'
import { View } from 'react-native'

import { Game } from './Game'
import { GameStatus } from './GameStatus'
import { ScreenOrientation } from './ScreenOrientation'
import { Settings } from './Settings'

interface State {
  confirmModalVisible: boolean
}

@observer
export class Footer extends Component<{}, State> {
  constructor(props: {}, context?: any) {
    super(props, context)

    this.state = {
      confirmModalVisible: false,
    }
  }

  public render() {
    const questionStyle: TextStyle = {
      fontSize: 24,
      marginBottom: 10,
      textAlign: 'center',
    }

    const textStyle: TextStyle = {
      backgroundColor: 'transparent',
      color: 'white',
      flex: 1,
      fontWeight: '700',
    }

    const rightAlignedTextStyle: TextStyle = {
      ...textStyle, ...{
        textAlign: 'right',
      },
    }

    return (
      <View
        style={{
          backgroundColor: Settings.instance.colors.mainBackgroundColor,
          paddingTop: 4,
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            marginLeft: 10,
            marginRight: 10,
          }}
        >
          <Text style={textStyle}>
            Moves: {Game.instance.moves}
          </Text>
          <Text style={textStyle}>
            Shuffles: {Game.instance.shuffles}
          </Text>
          <Text style={rightAlignedTextStyle}>
            Cards in correct spot: {Game.instance.currentGridState.correctlyPositionedCards.length}
          </Text>
        </View>
        <View
          style={{
            backgroundColor: Settings.instance.colors.mainBackgroundColor,
            flexDirection: 'row',
            flexWrap: 'wrap',
          }}
        >
          {this.renderButton('Undo', () => Game.instance.undo(), !Game.instance.undoPossible)}
          {this.renderButton('Redo', () => Game.instance.redo(), !Game.instance.redoPossible)}
          {this.renderButton('Shuffle', () => Game.instance.shuffleCardsInWrongPlace(), this.shuffleButtonDisabled())}
          {this.renderButton('Start Over', () => this.confirmUnlessGameOver())}
        </View>
        <Modal
          animationType="slide"
          supportedOrientations={['landscape']}
          transparent={false}
          visible={this.state.confirmModalVisible}
        >
          <View style={{ marginTop: 22 }}>
            <Text style={questionStyle}>
              The game isn't over yet. Start over anyway?
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

  private renderButton(title: string, handlePress: () => void, disabled?: boolean) {
    return (
      <View
        style={{
          backgroundColor: 'transparent',
          width: Settings.instance.screenOrientation === ScreenOrientation.Portrait
            ? '50%'
            : '25%',
        }}
      >
        <Button
          onPress={handlePress}
          disabled={disabled ? true : false}
          title={title}
        />
      </View>
    )
  }

  private confirmUnlessGameOver() {
    switch (Game.instance.gameStatus) {
      case GameStatus.GameLost:
      case GameStatus.GameWon:
        Game.instance.startOver()
        break

      case GameStatus.MovePossible:
      case GameStatus.Stuck:
        this.showConfirmModal()
        break

      default:
        throw new Error(`GameStatus ${Game.instance.gameStatus} is not supported.`)
    }
  }

  private hideConfirmModal() {
    this.setState({
      confirmModalVisible: false,
    })
  }

  private showConfirmModal() {
    this.setState({
      confirmModalVisible: true,
    })
  }

  private shuffleButtonDisabled() {
    const enabled = Game.instance.gameStatus === GameStatus.Stuck
    return !enabled
  }

  private startOver() {
    this.hideConfirmModal()
    Game.instance.startOver()
  }
}