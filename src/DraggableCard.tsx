import * as React from 'react'
import { Animated } from 'react-native'
import { Component } from 'react'
import { PanResponder } from 'react-native'
import { PanResponderInstance } from 'react-native'

import { CardView } from './CardView'
import { Suit } from './Suit'

interface Props {
  suit: Suit
  value: number
}

interface State {
  dragging: boolean
  offset: any
  pan: Animated.ValueXY
  position: Animated.ValueXY
}

export class DraggableCard extends Component<Props, State> {
  constructor(props: Props, context?: any) {
    super(props, context)

    this.state = {
      dragging: false,
      offset: {
        x: 0,
        y: 0
      },
      pan: new Animated.ValueXY(),
      position: new Animated.ValueXY()
    }

    this.panResponder = PanResponder.create({
      onPanResponderGrant: (e, gestureState) => {
        this.setState({
          dragging: true
        })
        this.state.pan.setOffset(this.state.offset)
      },
      onPanResponderMove: Animated.event([
        // tslint:disable-next-line:no-null-keyword
        null,
        {
          dx: this.state.pan.x,
          dy: this.state.pan.y
        }
      ] as any),
      onPanResponderRelease: () => {
        this.setState({
          dragging: false
        })
      },
      onStartShouldSetPanResponder: (e, g) => true
    })

    this.state.pan.addListener(offset => {
      this.setState({
        offset: offset
      })
    })
  }

  private panResponder: PanResponderInstance

  public render() {
    return (
      <Animated.View
        {...this.panResponder.panHandlers}
        style={this.state.pan.getLayout()}
      >
        <CardView
          dragging={this.state.dragging}
          suit={this.props.suit}
          value={this.props.value}
        />
      </Animated.View>
    )
  }
}