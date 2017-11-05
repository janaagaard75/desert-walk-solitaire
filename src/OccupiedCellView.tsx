import * as React from 'react'
import { Animated } from 'react-native'
import { Component } from 'react'
import { Easing } from 'react-native'
import { observer } from 'mobx-react'
import { PanResponder } from 'react-native'
import { PanResponderInstance } from 'react-native'

import { Card } from './Card'
import { CardView } from './CardView'
import { Game } from './Game'
import { OccupiedCell } from './OccupiedCell'

interface Props {
  occupiedCell: OccupiedCell
}

enum VisualState {
  Animating,
  Dragging,
  Idle,
}

// TODO: Move the state to a computed value.
interface State {
  visualState: VisualState
}

@observer
export class OccupiedCellView extends Component<Props, State> {
  constructor(props: Props, context?: any) {
    super(props, context)

    this.state = {
      visualState: VisualState.Idle,
    }

    this.animatedPosition = new Animated.ValueXY()

    this.panResponder = PanResponder.create({
      onPanResponderEnd: (e, gestureState) => {
        const dropOffset = Game.instance.cardDropped()

        if (dropOffset !== undefined) {
          this.animatedPosition.setValue(dropOffset)
        }

        this.setState({
          visualState: VisualState.Animating,
        })

        const animationTargetValue = {
          x: 0,
          y: 0,
        }

        Animated.timing(
          this.animatedPosition,
          {
            duration: 200,
            easing: Easing.elastic(1),
            toValue: animationTargetValue,
          },
        ).start(() => {
          if (this.state.visualState !== VisualState.Dragging) {
            this.setState({
              visualState: VisualState.Idle,
            })
          }
        })
      },
      onPanResponderGrant: (e, gestureState) => {
        Game.instance.cardDragStarted(this.props.occupiedCell)
      },
      onPanResponderMove:
        Animated.event([
          // tslint:disable-next-line:no-null-keyword
          null as any,
          {
            dx: this.animatedPosition.x,
            dy: this.animatedPosition.y,
          },
        ]),
      onPanResponderStart: (e, gestureState) => {
        this.setState({
          visualState: VisualState.Dragging,
        })
      },
      onStartShouldSetPanResponder: (e, gestureState) => true,
    })

    this.animatedPosition.addListener(position => {
      const boundary = Card.getBoundary(position)
      Game.instance.cardDragged(boundary)
    })
  }

  private animatedPosition: Animated.ValueXY
  private panResponder: PanResponderInstance

  public render() {
    this.animatedPosition.setOffset(this.props.occupiedCell.position)

    const style = {
      position: 'absolute',
      transform: this.animatedPosition.getTranslateTransform(),
      zIndex: this.state.visualState === VisualState.Idle ? 1 : 2,
    }

    const panHandlers = this.props.occupiedCell.draggable
      ? this.panResponder.panHandlers
      : undefined

    return (
      <Animated.View
        style={style}
        {...panHandlers}
      >
        <CardView
          card={this.props.occupiedCell.card}
          correctlyPlaced={this.props.occupiedCell.correctlyPlaced}
          draggable={this.props.occupiedCell.draggable}
          shadow={this.state.visualState !== VisualState.Idle}
        />
      </Animated.View>
    )
  }
}