import * as React from "react"
import { Component } from "react"
import {
  Animated,
  Easing,
  PanResponder,
  PanResponderInstance
} from "react-native"
import { CardView } from "./CardView"
import { ComputedSettings } from "./model/ComputedSettings"
import { Game } from "./model/Game"
import { Point } from "./model/Point"
import { PositionedCard } from "./model/PositionedCard"
import { Settings } from "./model/Settings"
import { Size } from "./model/Size"
import { VisualState } from "./VisualState"

interface Props {
  cardSize: Size
  positionedCard: PositionedCard
  setVisualState: (newState: VisualState) => void
  visualState: VisualState
}

interface State {
  animatedPosition: Animated.ValueXY
}

export class DraggableCardView extends Component<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = {
      animatedPosition: new Animated.ValueXY()
    }

    this.panResponder = PanResponder.create({
      onPanResponderEnd: (_e, gestureState) => {
        // TODO: If the card has been dragged too far away, then never consider it a 'press'.
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

        this.props.setVisualState(VisualState.Animating)

        const animationTargetValue = {
          x: 0,
          y: 0
        }

        Animated.timing(this.state.animatedPosition, {
          duration: duration,
          easing: Easing.elastic(Settings.animation.snap.elasticity),
          toValue: animationTargetValue
        }).start(() => {
          if (this.props.visualState !== VisualState.Dragging) {
            this.props.setVisualState(VisualState.Idle)
          }
        })
      },
      onPanResponderGrant: (_e, _gestureState) => {
        Game.instance.cardDragStarted(this.props.positionedCard)
      },
      onPanResponderMove: (e, gestureEvent) => {
        Animated.event([
          null,
          {
            dx: this.state.animatedPosition.x,
            dy: this.state.animatedPosition.y
          }
        ])(e, gestureEvent)
      },
      onPanResponderStart: (_e, _gestureState) => {
        this.props.setVisualState(VisualState.Dragging)
      },
      onStartShouldSetPanResponder: (_e, _gestureState) => true
    })

    this.state.animatedPosition.addListener(position => {
      const absolutePosition = this.props.positionedCard.position.add(position)
      const boundary = ComputedSettings.instance.getCardBoundary(
        absolutePosition
      )
      Game.instance.cardDragged(boundary)
    })
  }

  private panResponder: PanResponderInstance
  private readonly moveThreshold = 4

  public render() {
    return (
      <Animated.View
        style={{
          transform: this.state.animatedPosition.getTranslateTransform()
        }}
        {...this.panResponder.panHandlers}
      >
        <CardView
          card={this.props.positionedCard.card}
          cardSize={this.props.cardSize}
          correctlyPlaced={this.props.positionedCard.correctlyPlaced}
          draggable={this.isDraggable()}
          dragging={this.props.visualState === VisualState.Dragging}
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
    // TODO: Fix dragging a card.
    return Game.instance.moveCardToFirstTarget(this.props.positionedCard)
  }
}
