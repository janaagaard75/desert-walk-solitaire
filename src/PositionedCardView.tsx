import * as React from 'react'
import { Animated } from 'react-native'
import { Component } from 'react'
import { Easing } from 'react-native'
import { observer } from 'mobx-react'
import { PanResponder } from 'react-native'
import { PanResponderInstance } from 'react-native'

import { CardView } from './CardView'
import { Game } from './Game'
import { Point } from './Point'
import { PositionedCard } from './PositionedCard'
import { Settings } from './Settings'

interface Props {
  positionedCard: PositionedCard
}

enum VisualState {
  Animating,
  Dragging,
  Idle
}

interface State {
  visualState: VisualState
}

@observer
export class PositionedCardView extends Component<Props, State> {
  constructor(props: Props, context?: any) {
    super(props, context)

    this.state = {
      visualState: VisualState.Idle
    }

    this.animatedPosition = new Animated.ValueXY()

    this.panResponder = PanResponder.create({
      onPanResponderEnd: (e, gestureState) => {
        let animationVector: Point | undefined
        if (gestureState.dx === 0 && gestureState.dy === 0) {
          animationVector = this.props.positionedCard.moveToTarget()
        }
        else {
          animationVector = Game.instance.cardDropped()
        }

        if (animationVector !== undefined) {
          this.animatedPosition.setValue(animationVector)
        }

        this.setState({
          visualState: VisualState.Animating
        })

        const animationTargetValue = {
          x: 0,
          y: 0
        }

        Animated.timing(
          this.animatedPosition,
          {
            duration: Settings.instance.animation.snap.duration,
            easing: Easing.elastic(Settings.instance.animation.snap.elasticity),
            toValue: animationTargetValue
          }
        ).start(() => {
          if (this.state.visualState !== VisualState.Dragging) {
            this.setState({
              visualState: VisualState.Idle
            })
          }
        })
      },
      onPanResponderGrant: (e, gestureState) => {
        Game.instance.cardDragStarted(this.props.positionedCard)
      },
      onPanResponderMove: (e, gestureEvent) => {
        Animated.event([
          // tslint:disable-next-line:no-null-keyword
          null as any,
          {
            dx: this.animatedPosition.x,
            dy: this.animatedPosition.y
          }
        ])(e, gestureEvent)
      },
      onPanResponderStart: (e, gestureState) => {
        this.setState({
          visualState: VisualState.Dragging
        })
      },
      onStartShouldSetPanResponder: (e, gestureState) => true
    })

    this.animatedPosition.addListener(position => {
      const boundary = CardView.getBoundary(new Point(position.x, position.y))
      Game.instance.cardDragged(boundary)
    })
  }

  private animatedPosition: Animated.ValueXY
  private panResponder: PanResponderInstance

  public componentWillReceiveProps(nextProps: Props) {
    if (Game.instance.animateNextTurn
      && Game.instance.animateFromPreviousPosition
      && !this.props.positionedCard.position.equals(nextProps.positionedCard.position)
    ) {
      const animateFromOffset = this.props.positionedCard.position.subtract(nextProps.positionedCard.position)
      this.animatedPosition.setValue(animateFromOffset)

      this.setState({
        visualState: VisualState.Animating
      })

      Animated.timing(
        this.animatedPosition,
        {
          duration: Settings.instance.animation.turn.duration,
          easing: Easing.elastic(Settings.instance.animation.turn.elasticity),
          toValue: { x: 0, y: 0 }
        }
      ).start(() => {
        if (this.state.visualState !== VisualState.Dragging) {
          this.setState({
            visualState: VisualState.Idle
          })
        }
      })
    }
  }

  public render() {
    this.animatedPosition.setOffset(this.props.positionedCard.position)

    const style = {
      position: 'absolute',
      transform: this.animatedPosition.getTranslateTransform(),
      zIndex: this.state.visualState === VisualState.Idle ? 1 : 2
    }

    const panHandlers = this.props.positionedCard.draggable
      ? this.panResponder.panHandlers
      : undefined

    return (
      <Animated.View
        style={style}
        {...panHandlers}
      >
        <CardView
          card={this.props.positionedCard.card}
          correctlyPlaced={this.props.positionedCard.correctlyPlaced}
          draggable={this.props.positionedCard.draggable}
          dragged={this.state.visualState !== VisualState.Idle}
        />
      </Animated.View>
    )
  }
}