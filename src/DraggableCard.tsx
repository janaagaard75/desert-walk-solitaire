import * as React from 'react'
import { Component } from 'react'
import { PanResponder } from 'react-native'
import { PanResponderInstance } from 'react-native'
import { View } from 'react-native'
import { ViewStyle } from 'react-native'
import { ComponentState } from 'react'
import { ViewProperties } from 'react-native'

import { CardView } from './CardView'
import { Suit } from './Suit'

interface Props {
  height: number
  startPositionX: number
  startPositionY: number
  suit: Suit
  value: number
  width: number
}

interface State {
  dragging: boolean
  positionX: number
  positionY: number
}

export class DraggableCard extends Component<Props, State> {
  constructor(props: Props, context?: any) {
    super(props, context)

    this.state = {
      dragging: false,
      positionX: this.props.startPositionX,
      positionY: this.props.startPositionY
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
  private wrapperView: Component<ViewProperties, ComponentState> | null

  public render() {
    const style: ViewStyle = {
      left: this.state.positionX,
      position: 'absolute',
      top: this.state.positionY,
      zIndex: this.state.dragging ? 2 : 1
    }

    return (
      <View
        style={style}
        {...this.panResponder.panHandlers}
        ref={(view) => this.wrapperView = view}
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