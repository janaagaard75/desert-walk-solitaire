import * as React from 'react'
import { Component } from 'react'
import { observer } from 'mobx-react'
import { Text } from 'react-native'
import { TextStyle } from 'react-native'
import { View } from 'react-native'
import { ViewStyle } from 'react-native'

import { Club } from './suits/Club'
import { Diamond } from './suits/Diamond'
import { Heart } from './suits/Heart'
import { PlayingCard } from './PlayingCard'
import { Point } from './Point'
import { Rectangle } from './Rectangle'
import { Settings } from './Settings'
import { Spade } from './suits/Spade'
import { Suit } from './Suit'

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
      color: this.suitColor(),
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
          {this.props.card.value === 10
            ?
              [0, 1, 2, 3].map(y =>
                [0, 1, 2, 3].map(x =>
                  x >= y
                    ?
                      <View
                        key={`${x}${y}`}
                        style={{
                          bottom: 3 + x * 7.5 - y * 7.5,
                          position: 'absolute',
                          right: 3 + y * 7.5
                        }}
                      >
                        {this.suit(Settings.instance.cardSuitSize / 3)}
                      </View>
                    : undefined
                )
              )
            : undefined
          }
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

  private suit(size: number) {
    switch (this.props.card.suit) {
      case Suit.Clubs:
        return (
          <Club size={size}/>
        )

      case Suit.Diamonds:
        return (
          <Diamond size={size}/>
        )

      case Suit.Hearts:
        return (
          <Heart size={size}/>
        )

      case Suit.Spades:
        return (
          <Spade size={size}/>
        )
    }
  }

  private suitColor(): string {
    switch (this.props.card.suit) {
      case Suit.Clubs:
        return Settings.instance.colors.card.clubs

      case Suit.Diamonds:
        return Settings.instance.colors.card.diamonds

      case Suit.Hearts:
        return Settings.instance.colors.card.hearts

      case Suit.Spades:
        return Settings.instance.colors.card.spades
    }
  }
}