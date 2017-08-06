import * as React from 'react'
import { Component } from 'react'
import { observer } from 'mobx-react'
import { PanResponder } from 'react-native'
import { PanResponderInstance } from 'react-native'
import { View } from 'react-native'
import { ViewStyle } from 'react-native'

import { Card } from './Card'
import { CardView } from './CardView'
import { Position } from './Position'
import { Size } from './Size'

interface Props {
  card: Card
  isDraggable: boolean
  isInCorrectPlace: boolean
  onCardDropped: (cardCenter: Position) => void
  onCardMoved: (cardCenter: Position) => void
  onDragStarted: (card: Card) => void
  startPosition: Position
  size: Size
}

interface State {
  currentPosition: Position
  dragging: boolean
}

@observer
export class DraggableCard extends Component<Props, State> {
  constructor(props: Props, context?: any) {
    super(props, context)

    this.state = {
      currentPosition: this.props.startPosition,
      dragging: false
    }

    this.panResponder = PanResponder.create({
      onPanResponderEnd: (e, gestureState) => {
        this.setState({
          // Move the card back to the original position. This reposition is disregarded if the card is moved to a new cell because of the drop.
          currentPosition: this.props.startPosition,
          dragging: false
        })
        this.props.onCardDropped(this.getCardCenter())
      },
      onPanResponderGrant: (e, gestureState) => {
        this.dragStartPosition = this.state.currentPosition,
        this.setState({
          dragging: true
        })
        this.props.onDragStarted(this.props.card)
      },
      onPanResponderMove: (e, gestureState) => {
        this.setState({
          currentPosition: {
            left: this.dragStartPosition.left + gestureState.dx,
            top: this.dragStartPosition.top + gestureState.dy
          }
        })
        this.props.onCardMoved(this.getCardCenter())
      },
      onStartShouldSetPanResponder: (e, gestureState) => true
    })
  }

  private dragStartPosition: Position
  private panResponder: PanResponderInstance

  public render() {
    const style: ViewStyle = {
      left: this.state.currentPosition.left,
      position: 'absolute',
      top: this.state.currentPosition.top,
      zIndex: this.state.dragging ? 2 : 1
    }

    return (
      <View
        style={style}
        {...this.panResponder.panHandlers}
      >
        <CardView
          card={this.props.card}
          dragging={this.state.dragging}
          isDraggable={this.props.isDraggable}
          isInCorrectPlace={this.props.isInCorrectPlace}
          size={this.props.size}
        />
      </View>
    )
  }

  private getCardCenter(): Position {
    const cardCenter: Position = {
      left: this.state.currentPosition.left + this.props.size.width / 2,
      top: this.state.currentPosition.top + this.props.size.height / 2
    }

    return cardCenter
  }
}