import * as React from 'react'
import { Component } from 'react'
import { observer } from 'mobx-react'
import { Text } from 'react-native'
import { TextStyle } from 'react-native'
import { View } from 'react-native'
import { ViewStyle } from 'react-native'

import { Card } from './model/Card'
import { Point } from './model/Point'
import { Rectangle } from './model/Rectangle'
import { Settings } from './model/Settings'
import { SuitHelper } from './model/SuitHelper'
import { SuitView } from './SuitView'

interface Props {
  card: Card
  correctlyPlaced: boolean
  draggable: boolean
  dragged: boolean
}

@observer
export class CardView extends Component<Props> {
  public render() {
    return (
      <View style={this.getShadowStyle()}>
        <View style={this.getCardStyle()}>
          <Text style={this.getValueStyle()}>
            {this.props.card.displayValue}
          </Text>
          <View style={this.getSuitStyle()}>
            {this.suit(Settings.instance.cardSuitSize)}
          </View>
        </View>
        <View style={this.getOverlayStyle()} />
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

  private getCardStyle(): ViewStyle {
    return {
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
  }

  private getOverlayStyle(): ViewStyle {
    return {
      backgroundColor: '#000',
      borderRadius: Settings.instance.borderRadius,
      height: Settings.instance.cardSize.height,
      opacity: this.overlayOpacity(),
      position: 'absolute',
      width: Settings.instance.cardSize.width
    }
  }

  private getShadowStyle(): ViewStyle {
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

    return shadowStyle
  }

  private getSuitStyle(): ViewStyle {
    return {
      left: Settings.instance.cardSuitLeft,
      position: 'absolute',
      top: Settings.instance.cardSuitTop
    }
  }

  private getValueStyle(): TextStyle {
    return {
      color: SuitHelper.getColor(this.props.card.suit),
      fontSize: Settings.instance.cardValueFontSize,
      fontWeight: '700',
      left: Settings.instance.cardValueLeft,
      letterSpacing: Settings.instance.cardValueLetterSpacing,
      position: 'absolute',
      textAlign: 'center',
      top: Settings.instance.cardValueTop,
      width: Settings.instance.cardValueWidth // Make space for the two digits in '10'.
    }
  }

  private suit(size: number): JSX.Element {
    return <SuitView size={size} suit={this.props.card.suit} />
  }
}
