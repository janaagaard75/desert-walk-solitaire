import * as React from 'react'
import { Component } from 'react'
import { PanResponder } from 'react-native'
import { PanResponderInstance } from 'react-native'
import { View } from 'react-native'
import { ViewStyle } from 'react-native'

import { CardView } from './CardView'
import { Position } from './Position'
import { Suit } from './Suit'

interface Props {
  height: number
  startPosition: Position
  suit: Suit
  value: number
  width: number
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
          dragging={this.state.dragging}
          height={this.props.height}
          suit={this.props.suit}
          value={this.props.value}
          width={this.props.width}
        />
      </View>
    )
  }
}