import * as React from 'react'
import { Component } from 'react'
import { Text } from 'react-native'
import { TextStyle } from 'react-native'
import { View } from 'react-native'
import { ViewStyle } from 'react-native'

import { CardModel } from './CardModel'
import { Size } from './Size'
import { Suit } from './Suit'

interface Props {
  card: CardModel
  dragging: boolean
  isDraggable: boolean
  size: Size
}

export class CardView extends Component<Props, {}> {
  public render() {
    const cardStyle: ViewStyle = {
      alignItems: 'center',
      backgroundColor: this.props.isDraggable ? '#fee' : '#dcc',
      borderColor: 'black',
      borderRadius: 5,
      borderWidth: 1,
      height: this.props.size.height,
      padding: 2,
      width: this.props.size.width
    }

    if (this.props.dragging) {
      Object.assign(cardStyle, {
        shadowColor: 'black',
        shadowOffset: {
          height: 2,
          width: 1
        },
        shadowOpacity: 0.3,
        shadowRadius: 3
      })
    }

    const textStyle: TextStyle = {
      color: Suit.isBlack(this.props.card.suit) ? 'black' : 'red'
    }

    return (
      <View style={cardStyle}>
        <Text style={textStyle}>
          {this.getSuitUnicode(this.props.card.suit)} {this.getCardValue(this.props.card.value)}
        </Text>
      </View>
    )
  }

  private getSuitUnicode(suit: Suit): string {
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

  private getCardValue(value: number) {
    switch (value) {
      case 1:
        return 'A'

      case 11:
        return 'J'

      case 12:
        return 'Q'

      case 13:
        return 'K'

      default:
        return value
    }
  }
}