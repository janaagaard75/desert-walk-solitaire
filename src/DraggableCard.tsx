import * as React from 'react'
import { Animated } from 'react-native'
import { Component } from 'react'
import { Easing } from 'react-native'
import { observer } from 'mobx-react'
import { PanResponder } from 'react-native'
import { PanResponderInstance } from 'react-native'

import { Card } from './Card'
import { CardView } from './CardView'
import { Point } from './Point'
import { Rectangle } from './Rectangle'
import { Settings } from './Settings'

interface Props {
  card: Card
  isDraggable: boolean
  isInCorrectPlace: boolean
  onCardDropped: (cardRectangle: Rectangle) => void
  onCardMoved: (cardRectangle: Rectangle) => void
  onDragStarted: (card: Card) => void
  settings: Settings
}

enum VisualState {
  Animating,
  Dragging,
  Idle
}

interface State {
  visualState: VisualState
}

@observer
export class DraggableCard extends Component<Props, State> {
  constructor(props: Props, context?: any) {
    super(props, context)

    this.state = {
      visualState: VisualState.Idle
    }

    this.startPosition = this.props.card.position
    this.animatedPosition = new Animated.ValueXY()

    this.panResponder = PanResponder.create({
      onPanResponderEnd: (e, gestureState) => {
        this.props.onCardDropped(this.props.card.boundary)

        this.setState({
          visualState: VisualState.Animating
        })

        Animated.timing(
          this.animatedPosition,
          {
            duration: 200,
            easing: Easing.elastic(1),
            toValue: {
              x: 0,
              y: 0
            }
          }
        ).start(() => {
          if (this.state.visualState !== VisualState.Dragging) {
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
            dx: this.animatedPosition.x,
            dy: this.animatedPosition.y
          }
        ]),
      onPanResponderStart: (e, gestureState) => {
        this.startPosition = this.props.card.position
        this.setState({
          visualState: VisualState.Dragging
        })
      },
      onStartShouldSetPanResponder: (e, gestureState) => true
    })

    this.animatedPosition.addListener(position => {
      this.props.card.position = position
      this.props.onCardMoved(this.props.card.boundary)
    })
  }

  private animatedPosition: Animated.ValueXY
  private panResponder: PanResponderInstance
  private startPosition: Point

  public render() {
    this.animatedPosition.setOffset(this.startPosition)

    const style = {
      position: 'absolute',
      transform: this.animatedPosition.getTranslateTransform(),
      zIndex: this.state.visualState === VisualState.Idle ? 1 : 2
    }

    // TODO: Only initialize panResponder if the card is draggable.
    const panHandlers = this.props.isDraggable
      ? this.panResponder.panHandlers
      : undefined

    return (
      <Animated.View
        style={style}
        {...panHandlers}
      >
        <CardView
          card={this.props.card}
          isDraggable={this.props.isDraggable}
          isInCorrectPlace={this.props.isInCorrectPlace}
          settings={this.props.settings}
          shadow={this.state.visualState !== VisualState.Idle}
        />
      </Animated.View>
    )
  }
}