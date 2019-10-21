import * as React from "react"
import { Component } from "react"
import {
  Animated,
  Easing,
  PanResponder,
  PanResponderInstance
} from "react-native"
import { CardView } from "./CardView"
import { Game } from "./model/Game"
import { Point } from "./model/Point"
import { PositionedCard } from "./model/PositionedCard"
import { Settings } from "./model/Settings"
import { Size } from "./model/Size"

enum VisualState {
  Animating,
  Dragging,
  Idle
}

interface Props {
  animating: boolean
  cardSize: Size
  positionedCard: PositionedCard
}

interface State {
  animatedPosition: Animated.ValueXY
  visualState: VisualState
}

export class DraggableCardView extends Component<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = {
      animatedPosition: new Animated.ValueXY(),
      visualState: VisualState.Idle
    }

    this.panResponder = PanResponder.create({
      onPanResponderEnd: (_e, gestureState) => {
        const isPress =
          Math.abs(gestureState.dx) <= this.moveThreshold &&
          Math.abs(gestureState.dy) <= this.moveThreshold

        const animationVector = isPress
          ? this.moveToTarget()
          : Game.instance.cardDropped()

        const duration = isPress
          ? Settings.animation.turn.duration
          : Settings.animation.snap.duration

        if (animationVector !== undefined) {
          this.state.animatedPosition.setValue(animationVector)
        }

        this.setState({
          visualState: VisualState.Animating
        })

        const animationTargetValue = {
          x: 0,
          y: 0
        }

        Animated.timing(this.state.animatedPosition, {
          duration: duration,
          easing: Easing.elastic(Settings.animation.snap.elasticity),
          toValue: animationTargetValue
        }).start(() => {
          if (this.state.visualState !== VisualState.Dragging) {
            this.setState({
              visualState: VisualState.Idle
            })
          }
        })
      },
      onPanResponderGrant: (_e, _gestureState) => {
        Game.instance.cardDragStarted(this.props.positionedCard)
      },
      onPanResponderMove: (e, gestureEvent) => {
        Animated.event([
          // tslint:disable-next-line:no-null-keyword
          null,
          {
            dx: this.state.animatedPosition.x,
            dy: this.state.animatedPosition.y
          }
        ])(e, gestureEvent)
      },
      onPanResponderStart: (_e, _gestureState) => {
        this.setState({
          visualState: VisualState.Dragging
        })
      },
      onStartShouldSetPanResponder: (_e, _gestureState) => true
    })
  }

  private panResponder: PanResponderInstance
  private readonly moveThreshold = 4

  public render() {
    return (
      <Animated.View
        style={{
          transform: this.state.animatedPosition.getTranslateTransform(),
          // TODO: Fix z-index.
          zIndex: this.state.visualState === VisualState.Idle ? 1 : 2
        }}
        {...this.panResponder.panHandlers}
      >
        <CardView
          card={this.props.positionedCard.card}
          cardSize={this.props.cardSize}
          correctlyPlaced={this.props.positionedCard.correctlyPlaced}
          draggable={this.isDraggable()}
          dragged={this.state.visualState !== VisualState.Idle}
        />
      </Animated.View>
    )
  }

  private isDraggable(): boolean {
    const draggable = Game.instance.currentGridState.draggableCards.some(
      card => card === this.props.positionedCard.card
    )
    return draggable
  }

  /** Moves the card to the first available target. This is only called on cards that are draggable. Returns the vector used for the animating the move. */
  private moveToTarget(): Point {
    return Game.instance.moveCardToFirstTarget(this.props.positionedCard)
  }
}
