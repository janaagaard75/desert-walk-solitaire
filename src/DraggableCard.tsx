import * as React from 'react'
import { Animated } from 'react-native'
import { Component } from 'react'
import { observer } from 'mobx-react'
import { PanResponder } from 'react-native'
import { PanResponderInstance } from 'react-native'

import { Card } from './Card'
import { CardView } from './CardView'
import { Point } from './Point'
import { Size } from './Size'

interface Props {
  card: Card
  isDraggable: boolean
  isInCorrectPlace: boolean
  onCardDropped: (cardCenter: Point) => void
  onCardMoved: (cardCenter: Point) => void
  onDragStarted: (card: Card) => void
  startPosition: Point
  size: Size
}

enum VisualState {
  Animating,
  Dragging,
  Idle
}

interface State {
  // TODO: Is it necessary to have this in the state instead of a private property?
  translatedPosition: Animated.ValueXY,
  visualState: VisualState
}

@observer
export class DraggableCard extends Component<Props, State> {
  constructor(props: Props, context?: any) {
    super(props, context)

    this.state = {
      translatedPosition: new Animated.ValueXY({
        x: 0,
        y: 0
      }),
      visualState: VisualState.Idle
    }

    this.state.translatedPosition.setOffset({
      x: this.props.startPosition.x,
      y: this.props.startPosition.y
    })

    this.panResponder = PanResponder.create({
      onPanResponderEnd: (e, gestureState) => {
        // const cardCenter = this.getCardCenter({
        //   x: this.props.startPosition.x + gestureState.dx,
        //   y: this.props.startPosition.y + gestureState.dy
        // })
        // this.props.onCardDropped(cardCenter)

        // Move the card back to the original position. This reposition is disregarded if the card is moved to a new cell because of the drop.
        // this.state.translatedPosition.setValue({
        //   x: 0,
        //   y: 0
        // })

        this.setState({
          visualState: VisualState.Animating
        })

        Animated.spring(
          this.state.translatedPosition,
          {
            toValue: {
              x: 0,
              y: 0
            }
          }
        ).start(() => {
          if (this.state.visualState === VisualState.Animating) {
            this.setState({
              visualState: VisualState.Idle
            })
          }
        })
      },
      onPanResponderGrant: (e, gestureState) => {
        this.props.onDragStarted(this.props.card)
      },
      onPanResponderMove:
        Animated.event([
          // tslint:disable-next-line:no-null-keyword
          null as any,
          {
            dx: this.state.translatedPosition.x,
            dy: this.state.translatedPosition.y
          }
        ]),
      onPanResponderStart: (e, gestureState) => {
        this.setState({
          visualState: VisualState.Dragging
        })
      },
      onStartShouldSetPanResponder: (e, gestureState) => true
    })

    this.state.translatedPosition.addListener(position => {
      const cardCenter = this.getCardCenter({
        x: position.x,
        y: position.y
      })

      this.props.onCardMoved(cardCenter)
    })
  }

  private panResponder: PanResponderInstance

  public render() {
    const style = {
      position: 'absolute',
      transform: this.state.translatedPosition.getTranslateTransform(),
      zIndex: this.state.visualState === VisualState.Idle ? 1 : 2
    }

    return (
      <Animated.View
        style={style}
        {...this.panResponder.panHandlers}
      >
        <CardView
          card={this.props.card}
          isDraggable={this.props.isDraggable}
          isInCorrectPlace={this.props.isInCorrectPlace}
          shadow={this.state.visualState !== VisualState.Idle}
          size={this.props.size}
        />
      </Animated.View>
    )
  }

  private getCardCenter(position: Point): Point {
    const cardCenter: Point = {
      x: position.x + this.props.size.width / 2,
      y: position.y + this.props.size.height / 2
    }

    return cardCenter
  }
}