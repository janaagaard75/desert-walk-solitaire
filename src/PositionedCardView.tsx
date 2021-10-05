import { computed, observable } from "mobx"
import { observer } from "mobx-react"
import React, { Component } from "react"
import {
  Animated,
  Easing,
  PanResponder,
  PanResponderInstance,
} from "react-native"
import { CardView } from "./CardView"
import { ComputedSettings } from "./model/ComputedSettings"
import { Game } from "./model/Game"
import { PositionedCard } from "./model/PositionedCard"
import { Settings } from "./model/Settings"
import { Size } from "./model/Size"
import { VisualState } from "./VisualState"

interface Props {
  cardSize: Size
  positionedCard: PositionedCard
}

interface State {
  visualState: VisualState
}

@observer
export class PositionedCardView extends Component<Props> {
  public constructor(props: Props) {
    super(props)

    this.visualState = VisualState.Idle

    this.animatedPosition = new Animated.ValueXY(
      this.props.positionedCard.position
    )

    this.animatedPosition.addListener((position) => {
      const boundary = ComputedSettings.instance.getCardBoundary(position)
      Game.instance.cardDragged(boundary)
    })

    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (_e, _gestureState) => true,
      onPanResponderGrant: (_e, _gestureState) => {
        Game.instance.cardDragStarted(this.props.positionedCard)
        this.visualState = VisualState.Dragging
      },
      onPanResponderMove: (_e, gestureState) => {
        this.animatedPosition.setValue({
          x: this.props.positionedCard.position.x + gestureState.dx,
          y: this.props.positionedCard.position.y + gestureState.dy,
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

        if (Game.instance.cardDropped()) {
          return
        }

        Animated.timing(this.animatedPosition, {
          duration: Settings.animation.snap.duration,
          easing: Easing.elastic(Settings.animation.snap.elasticity),
          toValue: {
            x: this.props.positionedCard.position.x,
            y: this.props.positionedCard.position.y,
          },
          useNativeDriver: true,
        }).start(() => {
          this.visualState = VisualState.Idle
        })
      },
    })
  }

  private animatedPosition: Animated.ValueXY
  private panResponder: PanResponderInstance
  // TODO: Bigger threshold, perhaps mainly on bigger screens?
  private readonly moveThreshold = 8
  @observable private visualState: VisualState

  public componentDidUpdate(prevProps: Props, _prevState: State) {
    if (
      this.props.positionedCard.position.equals(
        prevProps.positionedCard.position
      )
    ) {
      return
    }

    this.visualState = VisualState.Animating

    Animated.spring(this.animatedPosition, {
      toValue: this.props.positionedCard.position,
      useNativeDriver: true,
    }).start(() => {
      this.visualState = VisualState.Idle
    })
  }

  public render() {
    return (
      <Animated.View
        style={{
          position: "absolute",
          transform: [
            {
              translateX: this.animatedPosition.x,
              translateY: this.animatedPosition.y,
            },
          ],
          zIndex: this.visualState === VisualState.Idle ? 1 : 2,
        }}
        {...(this.draggable ? this.panResponder.panHandlers : undefined)}
      >
        <CardView
          card={this.props.positionedCard.card}
          cardSize={this.props.cardSize}
          correctlyPlaced={this.props.positionedCard.correctlyPlaced}
          draggable={this.draggable}
          dragging={this.visualState === VisualState.Dragging}
        />
      </Animated.View>
    )
  }

  @computed
  private get draggable(): boolean {
    const draggable = Game.instance.currentGridState.draggableCards.includes(
      this.props.positionedCard.card
    )
    return draggable
  }

  /** Moves the card to the first available target. This is only called on cards that are draggable. Returns the vector used for the animating the move. */
  private moveToTarget(): void {
    Game.instance.moveCardToFirstTarget(this.props.positionedCard)
  }
}
