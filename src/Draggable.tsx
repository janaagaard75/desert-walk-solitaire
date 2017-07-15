import * as React from 'react'
import { Animated } from 'react-native'
import { Component } from 'react'
import { PanResponder } from 'react-native'
import { PanResponderInstance } from 'react-native'

interface Position {
  left: number
  top: number
}

interface Props {
  position: Position
}

interface State {
  opacity: number
  pan: Animated.ValueXY
}

export class Draggable extends Component<Props, State> {
  constructor(props: Props, context?: any) {
    super(props, context)

    this.state = {
      opacity: Draggable.normalOpacity,
      pan: new Animated.ValueXY()
    }

    this.panResponder = PanResponder.create({
      onPanResponderMove: Animated.event([
        // tslint:disable-next-line:no-null-keyword
        null,
        {
          dx: this.state.pan.x,
          dy: this.state.pan.y
        }
      ] as any),
      onPanResponderRelease: (e, g) => {
        Animated.spring(
          this.state.pan,
          {
            toValue: {
              x: 0,
              y: 0
            }
          }
        )
      },
      onStartShouldSetPanResponder: (e, g) => true
    })
  }

  private static readonly normalOpacity = 1
  // private static readonly draggingOpacity = 0.6

  private panResponder: PanResponderInstance

  public render() {
    return (
      <Animated.View
        {...this.panResponder.panHandlers}
        style={this.state.pan.getLayout()}
      >
        {this.props.children}
      </Animated.View>
    )
  }
}