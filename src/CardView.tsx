import { computed } from "mobx"
import { observer } from "mobx-react"
import * as React from "react"
import { Component } from "react"
import { Text, TextStyle, View, ViewStyle } from "react-native"
import { Card } from "./model/Card"
import { ComputedSettings } from "./model/ComputedSettings"
import { Settings } from "./model/Settings"
import { Size } from "./model/Size"
import { SuitHelper } from "./model/SuitHelper"
import { SuitView } from "./SuitView"

interface Props {
  card: Card
  cardSize: Size
  correctlyPlaced: boolean
  draggable: boolean
  dragging: boolean
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
            {this.getSuit(Math.round(0.55 * this.props.cardSize.width))}
          </View>
        </View>
        <View style={this.overlayStyle} />
      </View>
    )
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
      backgroundColor: Settings.colors.card.background,
      borderColor: Settings.colors.card.border,
      borderRadius: ComputedSettings.instance.borderRadius,
      borderStyle: "solid",
      borderWidth: ComputedSettings.instance.borderWidth,
      height: this.props.cardSize.height,
      overflow: "hidden",
      padding: ComputedSettings.instance.cardPadding,
      width: this.props.cardSize.width
    }
  }

  @computed
  private get overlayStyle(): ViewStyle {
    return {
      backgroundColor: "#000",
      borderRadius: ComputedSettings.instance.borderRadius,
      height: this.props.cardSize.height,
      opacity: this.overlayOpacity(),
      position: "absolute",
      width: this.props.cardSize.width
    }
  }

  @computed
  private get shadowStyle(): ViewStyle {
    const shadowStyle: ViewStyle = {
      borderRadius: ComputedSettings.instance.borderRadius,
      height: this.props.cardSize.height,
      width: this.props.cardSize.width
    }
    if (this.props.dragging) {
      Object.assign(shadowStyle, {
        shadowColor: Settings.colors.card.shadowColor,
        shadowOffset: ComputedSettings.instance.cardShadowOffset,
        shadowOpacity: Settings.cardShadowOpacity,
        shadowRadius: ComputedSettings.instance.cardShadowRadius
      })
    }

    return shadowStyle
  }

  @computed
  private get suitStyle(): ViewStyle {
    return {
      bottom: Math.round(0.1 * this.props.cardSize.width),
      position: "absolute",
      right: Math.round(0.025 * this.props.cardSize.width)
    }
  }

  @computed
  private get valueStyle(): TextStyle {
    return {
      color: SuitHelper.getColor(this.props.card.suit),
      fontFamily: "Arabian-onenightstand",
      fontSize: Math.round(0.7 * this.props.cardSize.width),
      fontWeight: "700",
      left: Math.round(0.04 * this.props.cardSize.width),
      letterSpacing: -Math.round(0.07 * this.props.cardSize.width),
      position: "absolute",
      textAlign: "left",
      top: -Math.round(0.08 * this.props.cardSize.width),
      width: Math.round(1.22 * this.props.cardSize.width) // Make space for the two digits in '10'.
    }
  }

  private getSuit(size: number): JSX.Element {
    return <SuitView size={size} suit={this.props.card.suit} />
  }
}
