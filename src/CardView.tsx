import { observer } from "mobx-react"
import React from "react"
import { Text, TextStyle, View, ViewStyle } from "react-native"
import { Card } from "./model/Card"
import { ComputedSettings } from "./model/ComputedSettings"
import { Settings } from "./model/Settings"
import { Size } from "./model/Size"
import { SuitHelper } from "./model/SuitHelper"
import { SuitView } from "./SuitView"
import { useComputed } from "./useComputed"

interface Props {
  card: Card
  cardSize: Size
  correctlyPlaced: boolean
  draggable: boolean
  dragging: boolean
}

export const CardView = observer((props: Props) => {
  const overlayOpacity = (): number => {
    if (props.draggable) {
      return 0
    }

    if (props.correctlyPlaced) {
      return 0.5
    }

    return 0.3
  }

  const cardStyle = useComputed((): ViewStyle => {
    return {
      alignItems: "center",
      backgroundColor: Settings.colors.card.background,
      borderColor: Settings.colors.card.border,
      borderRadius: ComputedSettings.instance.borderRadius,
      borderStyle: "solid",
      borderWidth: ComputedSettings.instance.borderWidth,
      height: props.cardSize.height,
      overflow: "hidden",
      padding: ComputedSettings.instance.cardPadding,
      width: props.cardSize.width,
    }
  })

  const overlayStyle = useComputed((): ViewStyle => {
    return {
      backgroundColor: "#000",
      borderRadius: ComputedSettings.instance.borderRadius,
      height: props.cardSize.height,
      opacity: overlayOpacity(),
      position: "absolute",
      width: props.cardSize.width,
    }
  })

  const shadowStyle = useComputed((): ViewStyle => {
    const shadowStyle: ViewStyle = {
      borderRadius: ComputedSettings.instance.borderRadius,
      height: props.cardSize.height,
      width: props.cardSize.width,
    }
    if (props.dragging) {
      Object.assign(shadowStyle, {
        shadowColor: Settings.colors.card.shadowColor,
        shadowOffset: ComputedSettings.instance.cardShadowOffset,
        shadowOpacity: Settings.cardShadowOpacity,
        shadowRadius: ComputedSettings.instance.cardShadowRadius,
      })
    }

    return shadowStyle
  })

  const suitStyle = useComputed((): ViewStyle => {
    return {
      bottom: Math.round(0.1 * props.cardSize.width),
      position: "absolute",
      right: Math.round(0.025 * props.cardSize.width),
    }
  })

  const valueStyle = useComputed((): TextStyle => {
    return {
      color: SuitHelper.getColor(props.card.suit),
      fontFamily: "Arabian-onenightstand",
      fontSize: Math.round(0.7 * props.cardSize.width),
      fontWeight: "700",
      left: Math.round(0.04 * props.cardSize.width),
      letterSpacing: -Math.round(0.07 * props.cardSize.width),
      position: "absolute",
      textAlign: "left",
      top: -Math.round(0.08 * props.cardSize.width),
      width: Math.round(1.22 * props.cardSize.width), // Make space for the two digits in '10'.
    }
  })

  const getSuit = (size: number): JSX.Element => (
    <SuitView size={size} suit={props.card.suit} />
  )

  return (
    <View style={shadowStyle}>
      <View style={cardStyle}>
        <Text style={valueStyle}>{props.card.displayValue}</Text>
        <View style={suitStyle}>
          {getSuit(Math.round(0.55 * props.cardSize.width))}
        </View>
      </View>
      <View style={overlayStyle} />
    </View>
  )
})
