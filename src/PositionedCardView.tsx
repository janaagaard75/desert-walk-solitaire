import { observer } from "mobx-react"
import React, { useEffect, useMemo, useState } from "react"
import { Animated, Easing, PanResponder } from "react-native"
import { CardView } from "./CardView"
import { ComputedSettings } from "./model/ComputedSettings"
import { Game } from "./model/Game"
import { PositionedCard } from "./model/PositionedCard"
import { Settings } from "./model/Settings"
import { Size } from "./model/Size"
import { useComputed } from "./useComputed"
import { usePrevious } from "./usePrevious"
import { VisualState } from "./VisualState"

interface Props {
  cardSize: Size
  positionedCard: PositionedCard
}

interface State {
  visualState: VisualState
}

// TODO: Bigger threshold, perhaps mainly on bigger screens?
const moveThreshold = 8

export const PositionedCardView = observer((props: Props) => {
  const [visualState, setVisualState] = useState(VisualState.Idle)

  const [animatedPosition] = useState(
    new Animated.ValueXY(props.positionedCard.position)
  )

  useEffect(() => {
    animatedPosition.addListener((position) => {
      const boundary = ComputedSettings.instance.getCardBoundary(position)
      Game.instance.cardDragged(boundary)
    })
  })

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: (_e, _gestureState) => true,
        onPanResponderGrant: (_e, _gestureState) => {
          Game.instance.cardDragStarted(props.positionedCard)
          setVisualState(VisualState.Dragging)
        },
        onPanResponderMove: (_e, gestureState) => {
          animatedPosition.setValue({
            x: props.positionedCard.position.x + gestureState.dx,
            y: props.positionedCard.position.y + gestureState.dy,
          })
        },
        onPanResponderEnd: (_e, gestureState) => {
          // TODO: The isPress logic does not take into account that the card might have been dragged away and the back to the original position, when letting go. If that has happened, this is not a 'press'.
          const isPress =
            Math.abs(gestureState.dx) <= moveThreshold &&
            Math.abs(gestureState.dy) <= moveThreshold

          if (isPress) {
            moveToTarget()
            return
          }

          if (Game.instance.cardDropped()) {
            return
          }

          Animated.timing(animatedPosition, {
            duration: Settings.animation.snap.duration,
            easing: Easing.elastic(Settings.animation.snap.elasticity),
            toValue: {
              x: props.positionedCard.position.x,
              y: props.positionedCard.position.y,
            },
            useNativeDriver: true,
          }).start(() => {
            setVisualState(VisualState.Idle)
          })
        },
      }),
    []
  )

  const previousProps = usePrevious(props)

  useEffect(() => {
    if (
      previousProps !== undefined &&
      props.positionedCard.position.equals(
        previousProps.positionedCard.position
      )
    ) {
      return
    }

    setVisualState(VisualState.Animating)

    Animated.spring(animatedPosition, {
      toValue: props.positionedCard.position,
      useNativeDriver: true,
    }).start(() => {
      setVisualState(VisualState.Idle)
    })
  })

  /** Moves the card to the first available target. This is only called on cards that are draggable. Returns the vector used for the animating the move. */
  const moveToTarget = (): void => {
    Game.instance.moveCardToFirstTarget(props.positionedCard)
  }

  const draggable = useComputed((): boolean => {
    const draggable = Game.instance.currentGridState.draggableCards.includes(
      props.positionedCard.card
    )
    return draggable
  })

  return (
    <Animated.View
      style={{
        position: "absolute",
        transform: [
          { translateX: animatedPosition.x },
          { translateY: animatedPosition.y },
        ],
        zIndex: visualState === VisualState.Idle ? 1 : 2,
      }}
      {...(draggable ? panResponder.panHandlers : undefined)}
    >
      <CardView
        card={props.positionedCard.card}
        cardSize={props.cardSize}
        correctlyPlaced={props.positionedCard.correctlyPlaced}
        draggable={draggable}
        dragging={visualState === VisualState.Dragging}
      />
    </Animated.View>
  )
})
