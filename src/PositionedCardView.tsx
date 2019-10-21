import { observer } from "mobx-react"
import * as React from "react"
import { Component } from "react"
import { Animated } from "react-native"
import { DraggableCardView } from "./DraggableCardView"
import { ComputedSettings } from "./model/ComputedSettings"
import { Game } from "./model/Game"
import { Point } from "./model/Point"
import { PositionedCard } from "./model/PositionedCard"
import { Size } from "./model/Size"

interface Props {
  cardSize: Size
  positionedCard: PositionedCard
}

interface State {
  animatedPosition: Animated.ValueXY
  animating: boolean
}

@observer
export class PositionedCardView extends Component<Props, State> {
  public constructor(props: Props) {
    super(props)

    this.state = {
      animatedPosition: new Animated.ValueXY(),
      animating: false
    }

    this.state.animatedPosition.addListener(position => {
      const boundary = ComputedSettings.instance.getCardBoundary(
        new Point(position.x, position.y)
      )
      Game.instance.cardDragged(boundary)
    })
  }

  // public UNSAFE_componentWillReceiveProps(nextProps: Props) {
  //   if (!this.animate) {
  //     return
  //   }

  //   const animateFromOffset = this.props.positionedCard.position.subtract(
  //     nextProps.positionedCard.position
  //   )
  //   this.animatedPosition.setValue(animateFromOffset)
  //   this.visualState = VisualState.Animating

  //   Animated.timing(this.animatedPosition, {
  //     duration: Settings.instance.animation.turn.duration,
  //     easing: Easing.elastic(Settings.instance.animation.turn.elasticity),
  //     toValue: { x: 0, y: 0 }
  //   }).start(() => {
  //     if (this.visualState !== VisualState.Dragging) {
  //       this.visualState = VisualState.Idle
  //     }
  //   })
  // }

  // private animate(nextProps: Props): boolean {
  //   return (
  //     Game.instance.animateNextTurn ||
  //     Game.instance.animateFromPreviousPosition ||
  //     !this.props.positionedCard.position.equals(
  //       nextProps.positionedCard.position
  //     )
  //   )
  // }

  public render() {
    this.state.animatedPosition.setOffset(this.props.positionedCard.position)

    return (
      <Animated.View
        style={{
          position: "absolute",
          transform: this.state.animatedPosition.getTranslateTransform()
        }}
      >
        <DraggableCardView
          animating={this.state.animating}
          cardSize={this.props.cardSize}
          positionedCard={this.props.positionedCard}
        />
      </Animated.View>
    )
  }
}
