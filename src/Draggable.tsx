import * as React from 'react'
import { Animated } from 'react-native'
import { Component } from 'react'
import { PanResponder } from 'react-native'
import { PanResponderInstance } from 'react-native'

// tslint:disable-next-line:no-empty-interface
interface Props { }

interface State {
  offset: any
  pan: Animated.ValueXY
  position: Animated.ValueXY
}

export class Draggable extends Component<Props, State> {
  constructor(props: Props, context?: any) {
    super(props, context)

    this.state = {
      offset: {
        x: 0,
        y: 0
      },
      pan: new Animated.ValueXY(),
      position: new Animated.ValueXY()
    }

    this.panResponder = PanResponder.create({
      onPanResponderGrant: (e, gestureState) => {
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
        this.state.pan.flattenOffset()
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
        {this.props.children}
      </Animated.View>
    )
  }
}