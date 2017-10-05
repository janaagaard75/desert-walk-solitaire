import * as React from 'react'
import { Button } from 'react-native'
import { Component } from 'react'
import { Modal } from 'react-native'
import { observer } from 'mobx-react'
import { Text } from 'react-native'
import { TextStyle } from 'react-native'
import { View } from 'react-native'

import { GameStatus } from './GameStatus'
import { ScreenOrientation } from './ScreenOrientation'
import { Settings } from './Settings'

interface Props {
  correctlyPlacedCards: number
  gameStatus: GameStatus
  moves: number
  onRedo: () => void
  onShuffleCardsInWrongPlace: () => void
  onStartOver: () => void
  onUndo: () => void
  redoPossible: boolean
  shuffles: number
  undoPossible: boolean
}

interface State {
  confirmModalVisible: boolean
}

@observer
export class Footer extends Component<Props, State> {
  constructor(props: Props, context?: any) {
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
            Moves: {this.props.moves}
          </Text>
          <Text style={textStyle}>
            Shuffles: {this.props.shuffles}
          </Text>
          <Text style={rightAlignedTextStyle}>
            Cards in correct spot: {this.props.correctlyPlacedCards}
          </Text>
        </View>
        <View
          style={{
            backgroundColor: Settings.instance.colors.mainBackgroundColor,
            flexDirection: 'row',
            flexWrap: 'wrap',
          }}
        >
          {this.renderButton('Undo', () => this.props.onUndo(), !this.props.undoPossible)}
          {this.renderButton('Redo', () => this.props.onRedo(), !this.props.redoPossible)}
          {this.renderButton('Shuffle', () => this.shuffleCardsInWrongPlace(), this.shuffleButtonDisabled())}
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
    switch (this.props.gameStatus) {
      case GameStatus.GameLost:
      case GameStatus.GameWon:
        this.props.onStartOver()
        break

      case GameStatus.MovePossible:
      case GameStatus.Stuck:
        this.showConfirmModal()
        break

      default:
        throw new Error(`GameStatus ${this.props.gameStatus} is not supported.`)
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
    const enabled = this.props.gameStatus === GameStatus.Stuck
    return !enabled
  }

  private shuffleCardsInWrongPlace() {
    this.props.onShuffleCardsInWrongPlace()
  }

  private startOver() {
    this.hideConfirmModal()
    this.props.onStartOver()
  }
}