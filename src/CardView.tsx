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
      backgroundColor: this.props.isInCorrectPlace ? '#dde5ee' : this.props.isDraggable ? 'white' : '#eee5dd',
      borderColor: this.props.isInCorrectPlace ? 'green' : this.props.isDraggable ? 'black' : '#888',
      borderRadius: 5,
      borderStyle: 'solid',
      borderWidth: 2,
      height: this.props.size.height,
      padding: 2,
      width: this.props.size.width
    }

    if (this.props.shadow) {
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