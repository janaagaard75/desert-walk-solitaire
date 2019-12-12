import { observer } from "mobx-react"
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
  positionedCard: PositionedCard
}

interface State {
  animatedPosition: Animated.ValueXY
  visualState: VisualState
}

@observer
export class PositionedCardView extends Component<Props, State> {
  public constructor(props: Props) {
    super(props)

    // TODO: Setting an initial value instead of using the offset doesn't work, but why not?
    this.state = {
      animatedPosition: new Animated.ValueXY(
        this.props.positionedCard.position
      ),
      visualState: VisualState.Idle
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

  // TODO: Turn on animation.
  // TODO: Turning this on probably also requires a listener on animatedPosition to know when the animation is done.
  public componentDidUpdate(prevProps: Props, _prevState: State) {
    if (
      this.props.positionedCard.position.equals(
        prevProps.positionedCard.position
      )
    ) {
      return
    }

    // const animateFromOffset = prevProps.positionedCard.position.subtract(
    //   this.props.positionedCard.position
    // )
    // this.state.animatedPosition.setValue(animateFromOffset)

    this.setState({
      visualState: VisualState.Animating
    })

    Animated.spring(this.state.animatedPosition, {
      toValue: this.props.positionedCard.position,
      useNativeDriver: true
    }).start()
  }

  public render() {
    return (
      <Animated.View
        style={{
          position: "absolute",
          transform: this.state.animatedPosition.getTranslateTransform(),
          zIndex: this.state.visualState === VisualState.Idle ? 1 : 2
        }}
        {...this.panResponder.panHandlers}
      >
        <CardView
          card={this.props.positionedCard.card}
          cardSize={this.props.cardSize}
          correctlyPlaced={this.props.positionedCard.correctlyPlaced}
          draggable={this.isDraggable()}
          dragging={this.state.visualState === VisualState.Dragging}
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
