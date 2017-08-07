import * as React from 'react'
import { Button } from 'react-native'
import { Component } from 'react'
import { Modal } from 'react-native'
import { observer } from 'mobx-react'
import { Text } from 'react-native'
import { TextStyle } from 'react-native'
import { View } from 'react-native'

interface Props {
  cardsInCorrectPlace: number
  gameOver: boolean
  moves: number
  shuffleDeckAndDealCards: () => void
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
              flex: 1,
              textAlign: 'right'
            }}
          >
            Cards in correct place: {this.props.cardsInCorrectPlace}
          </Text>
        </View>
        <View>
          <Button
            onPress={() => this.confirmUnlessGameOver()}
            title="Start Over"
          />
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
    if (this.props.gameOver) {
      this.props.shuffleDeckAndDealCards()
    }
    else {
      this.showConfirmModal()
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

  private startOver() {
    this.hideConfirmModal()
    this.props.shuffleDeckAndDealCards()
  }
}