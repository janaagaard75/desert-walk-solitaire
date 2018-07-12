import * as React from 'react'
import { Component } from 'react'
import { observer } from 'mobx-react'
import { Text } from 'react-native'
import { TextStyle } from 'react-native'
import { View } from 'react-native'
import { ViewStyle } from 'react-native'

import { PlayingCard } from './PlayingCard'
import { Point } from './Point'
import { Rectangle } from './Rectangle'
import { Settings } from './Settings'
import { Suit } from './Suit'
import { SuitView } from './SuitView'

interface Props {
  card: PlayingCard
  correctlyPlaced: boolean
  draggable: boolean
  dragged: boolean
}

@observer
export class PlayingCardView extends Component<Props> {
  public render() {
    const shadowStyle: ViewStyle = {
      borderRadius: Settings.instance.borderRadius,
      height: Settings.instance.cardSize.height,
      width: Settings.instance.cardSize.width
    }
    if (this.props.dragged) {
      Object.assign(shadowStyle, {
        shadowColor: Settings.instance.colors.card.shadowColor,
        shadowOffset: Settings.instance.cardShadowOffset,
        shadowOpacity: Settings.instance.cardShadowOpacity,
        shadowRadius: Settings.instance.cardShadowRadius
      })
    }

    const cardStyle: ViewStyle = {
      alignItems: 'center',
      backgroundColor: Settings.instance.colors.card.background,
      borderColor: Settings.instance.colors.card.border,
      borderRadius: Settings.instance.borderRadius,
      borderStyle: 'solid',
      borderWidth: Settings.instance.borderWidth,
      height: Settings.instance.cardSize.height,
      overflow: 'hidden',
      padding: Settings.instance.cardPadding,
      width: Settings.instance.cardSize.width
    }

    const valueStyle: TextStyle = {
      color: Suit.color(this.props.card.suit),
      fontSize: Settings.instance.cardValueFontSize,
      fontWeight: '700',
      left: Settings.instance.cardValueLeft,
      letterSpacing: Settings.instance.cardValueLetterSpacing,
      position: 'absolute',
      textAlign: 'center',
      top: Settings.instance.cardValueTop,
      width: Settings.instance.cardValueWidth // Make space for the two digits in '10'.
    }

    const suitStyle: ViewStyle = {
      left: Settings.instance.cardSuitLeft,
      position: 'absolute',
      top: Settings.instance.cardSuitTop
    }

    const overlayStyle: ViewStyle = {
      backgroundColor: '#000',
      borderRadius: Settings.instance.borderRadius,
      height: Settings.instance.cardSize.height,
      opacity: this.overlayOpacity(),
      position: 'absolute',
      width: Settings.instance.cardSize.width
    }

    return (
      <View style={shadowStyle}>
        <View style={cardStyle}>
          <Text style={valueStyle}>
            {this.props.card.displayValue}
          </Text>
          <View style={suitStyle}>
            {this.suit(Settings.instance.cardSuitSize)}
          </View>
          {this.getSmallSuits()}
        </View>
        <View style={overlayStyle}/>
      </View>
    )
  }

  public static getBoundary(position: Point): Rectangle {
    const boundary = new Rectangle(
      position.x,
      position.x + Settings.instance.cardSize.width,
      position.y,
      position.y + Settings.instance.cardSize.height
    )

    return boundary
  }

  private overlayOpacity(): number {
    if (this.props.draggable) {
      return 0
    }

    if (this.props.correctlyPlaced) {
      return 0.5
    }

    return 0.3
  }

  private getSmallSuits() {
    const smallSuits: { [index: number]: Array<Array<boolean>> } = {
      1: [
        [false, false, false, false],
        [false, false, false, false],
        [false, false, false, false],
        [false, false, false, true]
      ],
      2: [
        [false, false, false, false],
        [false, false, false, false],
        [false, false, false, true],
        [false, false, true, false]
      ],
      3: [
        [false, false, false, false],
        [false, false, false, true],
        [false, false, true, false],
        [false, true, false, false]
      ],
      4: [
        [false, false, false, false],
        [false, false, false, true],
        [false, false, true, false],
        [false, true, false, true]
      ],
      5: [
        [false, false, false, false],
        [false, false, false, true],
        [false, false, true, true],
        [false, true, true, false]
      ],
      6: [
        [false, false, false, false],
        [false, false, false, true],
        [false, false, true, true],
        [false, true, true, true]
      ],
      7: [
        [false, false, false, true],
        [false, false, true, false],
        [false, true, false, true],
        [true, false, true, true]
      ],
      8: [
        [false, false, false, true],
        [false, false, true, true],
        [false, true, true, false],
        [true, true, false, true]
      ],
      9: [
        [false, false, false, true],
        [false, false, true, true],
        [false, true, true, true],
        [true, true, true, false]
      ],
      10: [
        [false, false, false, true],
        [false, false, true, true],
        [false, true, true, true],
        [true, true, true, true]
      ]
    }

    return (
      [0, 1, 2, 3].map(y =>
        [0, 1, 2, 3].map(x => {
          if (smallSuits[this.props.card.value] !== undefined
            && smallSuits[this.props.card.value][x][y]
          ) {
            return this.getSmallSuit(x, y)
          }

          return undefined
        })
      )
    )
  }

  private getSmallSuit(x: number, y: number): JSX.Element {
    const margin = Math.round(Settings.instance.cardSize.width / 18)
    const gridSize = 4 - 1
    const gridSpace = Math.round(Settings.instance.cardSuitSize / 3)
    const suitSize = Math.round(Settings.instance.cardSuitSize / 4)

    return (
      <View
        key={`${x}${y}`}
        style={{
          bottom: gridSize * gridSpace - x * gridSpace + margin, // size * gridSize - x * gridSize + margin,
          position: 'absolute',
          right: gridSize * gridSpace - y * gridSpace + margin
        }}
      >
        {this.suit(suitSize)}
      </View>
    )
  }

  private suit(size: number): JSX.Element {
    return (
      <SuitView
        size={size}
        suit={this.props.card.suit}
      />
    )
  }
}