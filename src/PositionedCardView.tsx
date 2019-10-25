import { observer } from "mobx-react"
import * as React from "react"
import { Component } from "react"
import { Animated } from "react-native"
import { DraggableCardView } from "./DraggableCardView"
import { PositionedCard } from "./model/PositionedCard"
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

  // TODO: Turn on animation.
  // TODO: Turning this on probably also requires a listener on animatedPosition to know when the animation is done.
  // public componentDidUpdate(prevProps: Props, _prevState: State) {
  //   if (
  //     this.props.positionedCard.position.equals(
  //       prevProps.positionedCard.position
  //     )
  //   ) {
  //     return
  //   }

  //   const animateFromOffset = prevProps.positionedCard.position.subtract(
  //     this.props.positionedCard.position
  //   )
  //   this.state.animatedPosition.setValue(animateFromOffset)

  //   this.setState({
  //     visualState: VisualState.Animating
  //   })

  //   Animated.spring(this.state.animatedPosition, {
  //     toValue: this.props.positionedCard.position,
  //     useNativeDriver: true
  //   }).start()
  // }

  public render() {
    return (
      <Animated.View
        style={{
          position: "absolute",
          transform: this.state.animatedPosition.getTranslateTransform(),
          zIndex: this.state.visualState === VisualState.Idle ? 1 : 2
        }}
      >
        <DraggableCardView
          cardSize={this.props.cardSize}
          positionedCard={this.props.positionedCard}
          setVisualState={newState =>
            this.setState({
              visualState: newState
            })
          }
          visualState={this.state.visualState}
        />
      </Animated.View>
    )
  }
}
