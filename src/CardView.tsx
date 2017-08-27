import * as React from 'react'
import { Component } from 'react'
import { observer } from 'mobx-react'
import { Text } from 'react-native'
import { TextStyle } from 'react-native'
import { View } from 'react-native'
import { ViewStyle } from 'react-native'

import { Card } from './Card'
import { Size } from './Size'
import { Suit } from './Suit'

interface Props {
  card: Card
  isDraggable: boolean
  isInCorrectPlace: boolean
  shadow: boolean
  size: Size
}

@observer
export class CardView extends Component<Props, {}> {
  public render() {
    const cardStyle: ViewStyle = {
      alignItems: 'center',
      backgroundColor: this.props.isInCorrectPlace ? '#dde5ee' : this.props.isDraggable ? 'white' : '#ddd',
      borderColor: this.props.isInCorrectPlace ? '#4a4' : this.props.isDraggable ? 'black' : '#888',
      // TODO: Add a settings class.
      borderRadius: Math.floor(0.12 * this.props.size.width),
      borderStyle: 'solid',
      borderWidth: Math.floor(0.075 * this.props.size.width),
      height: this.props.size.height,
      overflow: 'hidden',
      padding: Math.floor(0.05 * this.props.size.width),
      width: this.props.size.width
    }

    if (this.props.shadow) {
      Object.assign(cardStyle, {
        shadowColor: 'black',
        shadowOffset: {
          height: Math.floor(0.05 * this.props.size.width),
          width: Math.floor(0.02 * this.props.size.width)
        },
        shadowOpacity: 0.3,
        shadowRadius: Math.floor(0.07 * this.props.size.width)
      })
    }

    const valueStyle: TextStyle = {
      color: CardView.getSuitColor(this.props.card.suit, this.props.isDraggable),
      fontSize: Math.floor(0.95 * this.props.size.width),
      fontWeight: '700',
      left: -Math.floor(0.12 * this.props.size.width),
      letterSpacing: -Math.floor(0.07 * this.props.size.width),
      position: 'absolute',
      top: -Math.floor(0.17 * this.props.size.width),
      width: Math.floor(1.22 * this.props.size.width) // Make space for the two digits in '10'.
    }

    const suitStyle: TextStyle = {
      backgroundColor: 'transparent',
      bottom: -Math.floor(0.12 * this.props.size.width),
      color: CardView.getSuitColor(this.props.card.suit, this.props.isDraggable),
      fontSize: Math.floor(this.props.size.width),
      fontWeight: '900',
      position: 'absolute',
      right: -Math.floor(0.12 * this.props.size.width)
    }

    return (
      <View style={cardStyle}>
        <Text style={valueStyle}>
          {this.props.card.displayValue}
        </Text>
        <Text style={suitStyle}>
          {CardView.getValueText(this.props.card.suit)}
        </Text>
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