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
      borderColor: this.props.isInCorrectPlace ? '#4a4' : this.props.isDraggable ? 'black' : '#b88',
      borderRadius: Math.floor(this.props.size.width / 41 * 5),
      borderStyle: 'solid',
      borderWidth: Math.floor(this.props.size.width / 41 * 3),
      height: this.props.size.height,
      overflow: 'hidden',
      padding: Math.floor(this.props.size.width / 41 * 2),
      width: this.props.size.width
    }

    if (this.props.shadow) {
      Object.assign(cardStyle, {
        shadowColor: 'black',
        shadowOffset: {
          height: Math.floor(this.props.size.width / 41 * 2),
          width: Math.floor(this.props.size.width / 41 * 1)
        },
        shadowOpacity: 0.3,
        shadowRadius: Math.floor(this.props.size.width / 41 * 3)
      })
    }

    const valueStyle: TextStyle = {
      color: Suit.color(this.props.card.suit),
      fontSize: Math.floor(this.props.size.width / 41 * 38),
      fontWeight: '700',
      left: -Math.floor(this.props.size.width / 41 * 5),
      letterSpacing: -Math.floor(this.props.size.width / 41 * 3),
      position: 'absolute',
      top: -Math.floor(this.props.size.width / 41 * 7),
      width: Math.floor(this.props.size.width / 41 * 50) // Make space for the two digits in '10'.
    }

    const suitStyle: TextStyle = {
      backgroundColor: 'transparent',
      bottom: -Math.floor(this.props.size.width / 41 * 5),
      color: Suit.color(this.props.card.suit),
      fontSize: Math.floor(this.props.size.width / 41 * 40),
      fontWeight: '900',
      position: 'absolute',
      right: -Math.floor(this.props.size.width / 41 * 5)
    }

    return (
      <View style={cardStyle}>
        <Text style={valueStyle}>
          {this.getCardValue(this.props.card.value)}
        </Text>
        <Text style={suitStyle}>
          {Suit.unicode(this.props.card.suit)}
        </Text>
      </View>
    )
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