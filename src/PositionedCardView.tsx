import * as React from "react";
import { Animated } from "react-native";
import { Component } from "react";
import { computed } from "mobx";
import { Easing } from "react-native";
import { observable } from "mobx";
import { observer } from "mobx-react";
import { PanResponder } from "react-native";
import { PanResponderInstance } from "react-native";

import { CardView } from "./CardView";
import { Game } from "./model/Game";
import { Point } from "./model/Point";
import { PositionedCard } from "./model/PositionedCard";
import { Settings } from "./model/Settings";

interface Props {
  positionedCard: PositionedCard;
}

enum VisualState {
  Animating,
  Dragging,
  Idle
}

@observer
export class PositionedCardView extends Component<Props> {
  constructor(props: Props, context?: any) {
    super(props, context);

    this.animatedPosition = new Animated.ValueXY();

    this.panResponder = PanResponder.create({
      onPanResponderEnd: (e, gestureState) => {
        const isPress =
          Math.abs(gestureState.dx) <= this.moveThreshold &&
          Math.abs(gestureState.dy) <= this.moveThreshold;

        const animationVector = isPress
          ? this.moveToTarget()
          : Game.instance.cardDropped();

        const duration = isPress
          ? Settings.instance.animation.turn.duration
          : Settings.instance.animation.snap.duration;

        if (animationVector !== undefined) {
          this.animatedPosition.setValue(animationVector);
        }

        this.visualState = VisualState.Animating;

        const animationTargetValue = {
          x: 0,
          y: 0
        };

        Animated.timing(this.animatedPosition, {
          duration: duration,
          easing: Easing.elastic(Settings.instance.animation.snap.elasticity),
          toValue: animationTargetValue
        }).start(() => {
          if (this.visualState !== VisualState.Dragging) {
            this.visualState = VisualState.Idle;
          }
        });
      },
      onPanResponderGrant: (e, gestureState) => {
        Game.instance.cardDragStarted(this.props.positionedCard);
      },
      onPanResponderMove: (e, gestureEvent) => {
        Animated.event([
          // tslint:disable-next-line:no-null-keyword
          null as any,
          {
            dx: this.animatedPosition.x,
            dy: this.animatedPosition.y
          }
        ])(e, gestureEvent);
      },
      onPanResponderStart: (e, gestureState) => {
        this.visualState = VisualState.Dragging;
      },
      onStartShouldSetPanResponder: (e, gestureState) => true
    });

    this.animatedPosition.addListener(position => {
      const boundary = CardView.getBoundary(new Point(position.x, position.y));
      Game.instance.cardDragged(boundary);
    });
  }

  private animatedPosition: Animated.ValueXY;
  private readonly moveThreshold = 4;
  private panResponder: PanResponderInstance;
  @observable private visualState: VisualState = VisualState.Idle;

  public componentWillReceiveProps(nextProps: Props) {
    if (
      Game.instance.animateNextTurn &&
      Game.instance.animateFromPreviousPosition &&
      !this.props.positionedCard.position.equals(
        nextProps.positionedCard.position
      )
    ) {
      const animateFromOffset = this.props.positionedCard.position.subtract(
        nextProps.positionedCard.position
      );
      this.animatedPosition.setValue(animateFromOffset);
      this.visualState = VisualState.Animating;

      Animated.timing(this.animatedPosition, {
        duration: Settings.instance.animation.turn.duration,
        easing: Easing.elastic(Settings.instance.animation.turn.elasticity),
        toValue: { x: 0, y: 0 }
      }).start(() => {
        if (this.visualState !== VisualState.Dragging) {
          this.visualState = VisualState.Idle;
        }
      });
    }
  }

  public render() {
    this.animatedPosition.setOffset(this.props.positionedCard.position);

    const style = {
      position: "absolute",
      transform: this.animatedPosition.getTranslateTransform(),
      zIndex: this.visualState === VisualState.Idle ? 1 : 2
    };

    const panHandlers = this.draggable
      ? this.panResponder.panHandlers
      : undefined;

    return (
      <Animated.View style={style} {...panHandlers}>
        <CardView
          card={this.props.positionedCard.card}
          correctlyPlaced={this.props.positionedCard.correctlyPlaced}
          draggable={this.draggable}
          dragged={this.visualState !== VisualState.Idle}
        />
      </Animated.View>
    );
  }

  @computed
  private get draggable(): boolean {
    const draggable = Game.instance.currentGridState.draggableCards.some(
      card => card === this.props.positionedCard.card
    );
    return draggable;
  }

  /** Moves the card to the first availble target. This is only called on cards that are draggable. Returns the vector used for the animating the move. */
  private moveToTarget(): Point {
    return Game.instance.moveCardToFirstTarget(this.props.positionedCard);
  }
}
