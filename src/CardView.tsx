import * as React from "react"
import { Component } from "react"
import { computed } from "mobx"
import { observer } from "mobx-react"
import { Text } from "react-native"
import { TextStyle } from "react-native"
import { View } from "react-native"
import { ViewStyle } from "react-native"

import { Card } from "./model/Card"
import { Point } from "./model/Point"
import { Rectangle } from "./model/Rectangle"
import { Settings } from "./model/Settings"
import { SuitHelper } from "./model/SuitHelper"
import { SuitView } from "./SuitView"

interface Props {
  card: Card
  correctlyPlaced: boolean
  draggable: boolean
  dragged: boolean
}

@observer
export class CardView extends Component<Props> {
  public constructor(props: Props) {
    super(props)
  }

  public render() {
    return (
      <View style={this.shadowStyle}>
        <View style={this.cardStyle}>
          <Text style={this.valueStyle}>{this.props.card.displayValue}</Text>
          <View style={this.suitStyle}>
            {this.getSuit(Math.round(0.55 * Settings.instance.cardSize.width))}
          </View>
        </View>
        <View style={this.overlayStyle} />
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

  @computed
  private get cardStyle(): ViewStyle {
    return {
      alignItems: "center",
      backgroundColor: Settings.instance.colors.card.background,
      borderColor: Settings.instance.colors.card.border,
      borderRadius: Settings.instance.borderRadius,
      borderStyle: "solid",
      borderWidth: Settings.instance.borderWidth,
      height: Settings.instance.cardSize.height,
      overflow: "hidden",
      padding: Settings.instance.cardPadding,
      width: Settings.instance.cardSize.width
    }
  }

  @computed
  private get overlayStyle(): ViewStyle {
    return {
      backgroundColor: "#000",
      borderRadius: Settings.instance.borderRadius,
      height: Settings.instance.cardSize.height,
      opacity: this.overlayOpacity(),
      position: "absolute",
      width: Settings.instance.cardSize.width
    }
  }

  @computed
  private get shadowStyle(): ViewStyle {
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

  @computed
  private get suitStyle(): ViewStyle {
    return {
      bottom: Math.round(0.1 * Settings.instance.cardSize.width),
      position: "absolute",
      right: Math.round(0.025 * Settings.instance.cardSize.width)
    }
  }

  @computed
  private get valueStyle(): TextStyle {
    return {
      color: SuitHelper.getColor(this.props.card.suit),
      fontFamily: "Arabian-onenightstand",
      fontSize: Math.round(0.7 * Settings.instance.cardSize.width),
      fontWeight: "700",
      left: Math.round(0.04 * Settings.instance.cardSize.width),
      letterSpacing: -Math.round(0.07 * Settings.instance.cardSize.width),
      position: "absolute",
      textAlign: "left",
      top: -Math.round(0.08 * Settings.instance.cardSize.width),
      width: Math.round(1.22 * Settings.instance.cardSize.width) // Make space for the two digits in '10'.
    }
  }

  private getSuit(size: number): JSX.Element {
    return <SuitView size={size} suit={this.props.card.suit} />
  }
}
