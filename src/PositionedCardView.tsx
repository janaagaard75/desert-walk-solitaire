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
import { VisualState } from "./VisualState"

interface Props {
  cardSize: Size
  draggable: boolean
  positionedCard: PositionedCard
}

interface State {
  visualState: VisualState
}

export class PositionedCardView extends Component<Props, State> {
  public constructor(props: Props) {
    super(props)

    // TODO: Setting an initial value instead of using the offset doesn't work, but why not?
    this.state = {
      visualState: VisualState.Idle
    }

    this.animatedPosition = new Animated.ValueXY(
      this.props.positionedCard.position
    )

    this.panResponder = this.props.draggable
      ? PanResponder.create({
          onStartShouldSetPanResponder: (_e, _gestureState) => true,
          onPanResponderGrant: (_e, _gestureState) => {
            Game.instance.cardDragStarted(this.props.positionedCard)
            this.setState({
              visualState: VisualState.Dragging
            })
          },
          onPanResponderMove: (_e, gestureState) => {
            this.animatedPosition.setValue({
              x: this.props.positionedCard.position.x + gestureState.dx,
              y: this.props.positionedCard.position.y + gestureState.dy
            })
          },
          onPanResponderEnd: (_e, gestureState) => {
            // TODO: The isPress logic does not take into account that the card might have been dragged away and the back to the original position, when letting go. If that has happened, this is not a 'press'.
            const isPress =
              Math.abs(gestureState.dx) <= this.moveThreshold &&
              Math.abs(gestureState.dy) <= this.moveThreshold

            if (isPress) {
              this.moveToTarget()
              return
            }

            Animated.timing(this.animatedPosition, {
              duration: Settings.animation.snap.duration,
              easing: Easing.elastic(Settings.animation.snap.elasticity),
              toValue: {
                x: this.props.positionedCard.position.x,
                y: this.props.positionedCard.position.y
              },
              useNativeDriver: true
            }).start(() => {
              this.setState({
                visualState: VisualState.Idle
              })
            })

            // TODO: The app sometimes crashes when letting go of a card.
          }
        })
      : undefined
  }

  private animatedPosition: Animated.ValueXY
  private panResponder: PanResponderInstance | undefined
  private readonly moveThreshold = 4

  public componentDidUpdate(prevProps: Props, _prevState: State) {
    if (
      this.props.positionedCard.position.equals(
        prevProps.positionedCard.position
      )
    ) {
      return
    }

    this.setState({
      visualState: VisualState.Animating
    })

    Animated.spring(this.animatedPosition, {
      toValue: this.props.positionedCard.position,
      useNativeDriver: true
    }).start(() => {
      this.setState({
        visualState: VisualState.Idle
      })
    })
  }

  public render() {
    return (
      <Animated.View
        style={{
          position: "absolute",
          transform: this.animatedPosition.getTranslateTransform(),
          zIndex: this.state.visualState === VisualState.Idle ? 1 : 2
        }}
        // TODO: Only add panHandlers if isDraggable is true.
        {...(this.panResponder === undefined
          ? undefined
          : this.panResponder.panHandlers)}
      >
        <CardView
          card={this.props.positionedCard.card}
          cardSize={this.props.cardSize}
          correctlyPlaced={this.props.positionedCard.correctlyPlaced}
          draggable={this.props.draggable}
          dragging={this.state.visualState === VisualState.Dragging}
        />
      </Animated.View>
    )
  }

  /** Moves the card to the first available target. This is only called on cards that are draggable. Returns the vector used for the animating the move. */
  private moveToTarget(): Point {
    // TODO: Fix dragging a card.
    return Game.instance.moveCardToFirstTarget(this.props.positionedCard)
  }
}
