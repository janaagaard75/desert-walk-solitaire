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
  startPosition: Point
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

    this.translatedPosition = new Animated.ValueXY({
      x: 0,
      y: 0
    })

    this.panResponder = PanResponder.create({
      onPanResponderEnd: (e, gestureState) => {
        const cardRectangle = this.getCardRectangle({
          x: this.props.startPosition.x + gestureState.dx,
          y: this.props.startPosition.y + gestureState.dy
        })
        this.props.onCardDropped(cardRectangle)

        this.setState({
          visualState: VisualState.Animating
        })

        Animated.timing(
          this.translatedPosition,
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
            dx: this.translatedPosition.x,
            dy: this.translatedPosition.y
          }
        ]),
      onPanResponderStart: (e, gestureState) => {
        this.setState({
          visualState: VisualState.Dragging
        })
      },
      onStartShouldSetPanResponder: (e, gestureState) => true
    })

    this.translatedPosition.addListener(position => {
      const cardRectangle = this.getCardRectangle({
        x: position.x,
        y: position.y
      })

      this.props.onCardMoved(cardRectangle)
    })
  }

  private panResponder: PanResponderInstance
  private translatedPosition: Animated.ValueXY

  public render() {
    this.translatedPosition.setOffset({
      x: this.props.startPosition.x,
      y: this.props.startPosition.y
    })

    const style = {
      position: 'absolute',
      transform: this.translatedPosition.getTranslateTransform(),
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

  private getCardRectangle(position: Point): Rectangle {
    const cardRectangle = new Rectangle(
      position.x,
      position.x + this.props.settings.cardSize.width,
      position.y,
      position.y + this.props.settings.cardSize.height)

    return cardRectangle
  }
}

// TODO: Move translatedPosition to the Card class.
// TODO: Remove startPosition, and initialize translatedPosition instead.
// TODO: The listener on translatedPosition can probably be moved to a more appropriate place.