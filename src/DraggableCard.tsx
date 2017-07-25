import * as React from 'react'
import { Component } from 'react'
import { PanResponder } from 'react-native'
import { PanResponderInstance } from 'react-native'
import { View } from 'react-native'
import { ViewStyle } from 'react-native'

import { CardModel } from './CardModel'
import { CardView } from './CardView'
import { Position } from './Position'
import { Size } from './Size'

interface Props {
  card: CardModel
  startPosition: Position
  size: Size
}

interface State {
  currentPosition: Position
  dragging: boolean
}

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
          dragging: false
        })
      },
      onPanResponderGrant: (e, gestureState) => {
        this.dragStartPosition = {
          left: this.state.currentPosition.left,
          top: this.state.currentPosition.top
        }
        this.setState({
          dragging: true
        })
      },
      onPanResponderMove: (e, gestureState) => {
        this.setState({
          currentPosition: {
            left: this.dragStartPosition.left + gestureState.dx,
            top: this.dragStartPosition.top + gestureState.dy
          }
        })
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
          size={this.props.size}
        />
      </View>
    )
  }
}