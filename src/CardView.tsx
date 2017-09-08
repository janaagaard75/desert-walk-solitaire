import * as React from 'react'
import { Component } from 'react'
import { observer } from 'mobx-react'
import { Text } from 'react-native'
import { TextStyle } from 'react-native'
import { View } from 'react-native'
import { ViewStyle } from 'react-native'

import { Card } from './Card'
import { Settings } from './Settings'
import { Suit } from './Suit'

interface Props {
  card: Card
  isDraggable: boolean
  isInCorrectPlace: boolean
  shadow: boolean
}

@observer
export class CardView extends Component<Props, {}> {
  public render() {
    const shadowStyle: ViewStyle = {
      borderRadius: Settings.instance.borderRadius,
      height: Settings.instance.cardSize.height,
      width: Settings.instance.cardSize.width
    }
    if (this.props.shadow) {
      Object.assign(shadowStyle, {
        shadowColor: 'black',
        shadowOffset: {
          height: Math.floor(0.05 * Settings.instance.cardSize.width),
          width: Math.floor(0.02 * Settings.instance.cardSize.width)
        },
        shadowOpacity: 0.3,
        shadowRadius: Math.floor(0.07 * Settings.instance.cardSize.width)
      })
    }

    const cardStyle: ViewStyle = {
      alignItems: 'center',
      backgroundColor: this.props.isDraggable ? 'white' : this.props.isInCorrectPlace ? '#dde5ee' : '#ddd',
      borderColor: this.props.isInCorrectPlace ? '#4a4' : this.props.isDraggable ? 'black' : '#888',
      borderRadius: Settings.instance.borderRadius,
      borderStyle: 'solid',
      borderWidth: Settings.instance.borderWidth,
      height: Settings.instance.cardSize.height,
      overflow: 'hidden',
      padding: Math.floor(0.05 * Settings.instance.cardSize.width),
      width: Settings.instance.cardSize.width
    }

    const valueStyle: TextStyle = {
      color: CardView.getSuitColor(this.props.card.suit, this.props.isDraggable),
      fontSize: Math.floor(0.95 * Settings.instance.cardSize.width),
      fontWeight: '700',
      left: -Math.floor(0.12 * Settings.instance.cardSize.width),
      letterSpacing: -Math.floor(0.07 * Settings.instance.cardSize.width),
      position: 'absolute',
      top: -Math.floor(0.17 * Settings.instance.cardSize.width),
      width: Math.floor(1.22 * Settings.instance.cardSize.width) // Make space for the two digits in '10'.
    }

    const suitStyle: TextStyle = {
      backgroundColor: 'transparent',
      bottom: -Math.floor(0.12 * Settings.instance.cardSize.width),
      color: CardView.getSuitColor(this.props.card.suit, this.props.isDraggable),
      fontSize: Math.floor(Settings.instance.cardSize.width),
      fontWeight: '900',
      position: 'absolute',
      right: -Math.floor(0.12 * Settings.instance.cardSize.width)
    }

    return (
      <View style={shadowStyle}>
        <View style={cardStyle}>
          <Text style={valueStyle}>
            {this.props.card.displayValue}
          </Text>
          <Text style={suitStyle}>
            {CardView.getValueText(this.props.card.suit)}
          </Text>
        </View>
      </View>
    )
  }

  private static getSuitColor(suit: Suit, isDraggable: boolean): string {
    if (suit === Suit.Clubs || suit === Suit.Spades) {
      if (isDraggable) {
        return '#000'
      }
      else {
        return '#666'
      }
    }
    else {
      if (isDraggable) {
        return '#f00'
      }
      else {
        return '#f66'
      }
    }
  }

  private static getValueText(suit: Suit): string {
    switch (suit) {
      case Suit.Clubs:
        return '\u2667'

      case Suit.Diamonds:
        return '\u2662'

      case Suit.Hearts:
        return '\u2661'

      case Suit.Spades:
        return '\u2664'
    }
  }
}