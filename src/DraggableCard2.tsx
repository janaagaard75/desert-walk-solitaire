import * as React from 'react'
import { Component } from 'react'
import { PanResponder } from 'react-native'
import { PanResponderInstance } from 'react-native'
import { View } from 'react-native'
import { ViewStyle } from 'react-native'

import { CardView } from './CardView'
import { Suit } from './Suit'

interface Props {
  suit: Suit
  value: number
}

interface State {
  dragging: boolean
  positionX: number
  positionY: number
}

export class DraggableCard2 extends Component<Props, State> {
  constructor(props: Props, context?: any) {
    super(props, context)

    this.state = {
      dragging: false,
      positionX: 0,
      positionY: 0
    }

    this.panResponder = PanResponder.create({
      onPanResponderEnd: (e, gestureState) => {
        this.setState({
          dragging: false
        })
      },
      onPanResponderGrant: (e, gestureState) => {
        this.startPositionX = this.state.positionX
        this.startPositionY = this.state.positionY
        this.setState({
          dragging: true
        })
      },
      onPanResponderMove: (e, gestureState) => {
        this.setState({
          positionX: this.startPositionX + gestureState.dx,
          positionY: this.startPositionY + gestureState.dy
        })
      },
      onStartShouldSetPanResponder: (e, gestureState) => true
    })
  }

  private panResponder: PanResponderInstance
  private startPositionX: number
  private startPositionY: number

  public render() {
    const style: ViewStyle = {
      left: this.state.positionX,
      top: this.state.positionY
    }

    return (
      <View
        style={style}
        {...this.panResponder.panHandlers}
      >
        <CardView
          dragging={this.state.dragging}
          suit={this.props.suit}
          value={this.props.value}
        />
      </View>
    )
  }
}