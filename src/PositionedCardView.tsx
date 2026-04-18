import { observer } from "mobx-react-lite";
import { useEffect, useMemo, useState } from "react";
import { Animated, Easing, PanResponder } from "react-native";
import { CardView } from "./CardView";
import { ComputedSettings } from "./model/ComputedSettings";
import { Game } from "./model/Game";
import { PositionedCard } from "./model/PositionedCard";
import { Settings } from "./model/Settings";
import { Size } from "./model/Size";
import { VisualState } from "./model/VisualState";

interface Props {
  cardSize: Size;
  positionedCard: PositionedCard;
}

export const PositionedCardView = observer((props: Props) => {
  const [visualState, setVisualState] = useState<VisualState>("idle");

  const draggable = Game.instance.currentGridState.draggableCards.includes(
    props.positionedCard.card,
  );

  const [animatedPosition] = useState(
    () => new Animated.ValueXY(props.positionedCard.position),
  );

  const targetX = props.positionedCard.position.x;
  const targetY = props.positionedCard.position.y;

  // TODO: Bigger threshold, perhaps mainly on bigger screens?
  const moveThreshold = 8;
  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onPanResponderEnd: (_e, gestureState) => {
          // TODO: The isPress logic does not take into account that the card might have been dragged away and the back to the original position, when letting go. If that has happened, this is not a 'press'.
          const isPress =
            Math.abs(gestureState.dx) <= moveThreshold
            && Math.abs(gestureState.dy) <= moveThreshold;

          if (isPress) {
            // Moves the card to the first available target. This is only called on cards that are draggable. Returns the vector used for the animating the move.
            Game.instance.moveCardToFirstTarget(props.positionedCard);
            return;
          }

          if (Game.instance.cardDropped()) {
            return;
          }

          Animated.timing(animatedPosition, {
            duration: Settings.animation.snap.duration,
            easing: Easing.elastic(Settings.animation.snap.elasticity),
            toValue: { x: targetX, y: targetY },
            useNativeDriver: true,
          }).start(() => {
            setVisualState("idle");
          });
        },
        onPanResponderGrant: (_e, _gestureState) => {
          const initialBoundary = ComputedSettings.instance.getCardBoundary({
            x: targetX,
            y: targetY,
          });
          Game.instance.cardDragStarted(props.positionedCard, initialBoundary);
          setVisualState("dragging");
        },
        onPanResponderMove: (_e, gestureState) => {
          animatedPosition.setValue({
            x: targetX + gestureState.dx,
            y: targetY + gestureState.dy,
          });
        },
        onStartShouldSetPanResponder: (_e, _gestureState) => true,
      }),
    [animatedPosition, props.positionedCard, targetX, targetY],
  );

  useEffect(() => {
    animatedPosition.addListener((position) => {
      const boundary = ComputedSettings.instance.getCardBoundary(position);
      Game.instance.cardDragged(boundary);
    });
  }, [animatedPosition]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks-extra/no-direct-set-state-in-use-effect
    setVisualState("animating");

    Animated.spring(animatedPosition, {
      toValue: { x: targetX, y: targetY },
      useNativeDriver: true,
    }).start(() => {
      setVisualState("idle");
    });
  }, [animatedPosition, targetX, targetY]);

  return (
    <Animated.View
      style={{
        position: "absolute",
        transform: [
          { translateX: animatedPosition.x },
          { translateY: animatedPosition.y },
        ],
        zIndex: visualState === "idle" ? 1 : 2,
      }}
      {...(draggable ? panResponder.panHandlers : undefined)}
    >
      <CardView
        card={props.positionedCard.card}
        cardSize={props.cardSize}
        correctlyPlaced={props.positionedCard.correctlyPlaced}
        draggable={draggable}
        dragging={visualState === "dragging"}
      />
    </Animated.View>
  );
});
