import * as React from 'react'
import { Button } from 'react-native'
import { Component } from 'react'
import { Modal } from 'react-native'
import { observer } from 'mobx-react'
import { Text } from 'react-native'
import { TextStyle } from 'react-native'
import { View } from 'react-native'

import { GameStatus } from './GameStatus'

interface Props {
  cardsInCorrectPlace: number
  gameStatus: GameStatus
  moves: number
  shuffleCardsInWrongPlace: () => void
  startOver: () => void
  shuffles: number
}

interface State {
  confirmModalVisible: boolean
}

@observer
export class Footer extends Component<Props, State> {
  constructor(props: Props, context?: any) {
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
      <View>
        <View
          style={{
            flexDirection: 'row',
            marginLeft: 10,
            marginRight: 10
          }}
        >
          <Text
            style={{
              flex: 1
            }}
          >
            Moves: {this.props.moves}
          </Text>
          <Text
            style={{
              flex: 1
            }}
          >
            Shuffles: {this.props.shuffles}
          </Text>
          <Text
            style={{
              flex: 1,
              textAlign: 'right'
            }}
          >
            Cards in correct spot: {this.props.cardsInCorrectPlace}
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row'
          }}
        >
          <View
            style={{
              flex: 1
            }}
          >
            <Button
              onPress={() => this.shuffleCardsInWrongPlace()}
              title="Shuffle"
            />
          </View>
          <View
            style={{
              flex: 1
            }}
          >
            <Button
              onPress={() => this.confirmUnlessGameOver()}
              title="Start Over"
            />
          </View>
        </View>
        <Modal
          animationType="slide"
          supportedOrientations={['landscape']}
          transparent={false}
          visible={this.state.confirmModalVisible}
        >
          <View style={{ marginTop: 22 }}>
            <Text style={questionStyle}>
              Are you sure you want to start over?
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

  private confirmUnlessGameOver() {
    switch (this.props.gameStatus) {
      case GameStatus.GameLost:
      case GameStatus.GameWon:
        this.props.startOver()

      case GameStatus.MovePossible:
      case GameStatus.ShuffleCards:
        this.showConfirmModal()

      default:
        throw new Error(`GameStatus ${this.props.gameStatus} is not supported.`)
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

  private shuffleCardsInWrongPlace() {
    // TODO: Should disable the button instead.
    if (this.props.gameStatus === GameStatus.ShuffleCards) {
      this.props.shuffleCardsInWrongPlace()
    }
  }

  private startOver() {
    this.hideConfirmModal()
    this.props.startOver()
  }
}