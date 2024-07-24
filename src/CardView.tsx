import { observer } from "mobx-react-lite";
import { Text, TextStyle, View, ViewStyle } from "react-native";
import { Card } from "./model/Card";
import { ComputedSettings } from "./model/ComputedSettings";
import { Settings } from "./model/Settings";
import { Size } from "./model/Size";
import { SuitHelper } from "./model/SuitHelper";
import { SuitView } from "./SuitView";

interface Props {
  card: Card;
  cardSize: Size;
  correctlyPlaced: boolean;
  draggable: boolean;
  dragging: boolean;
}

export const CardView = observer((props: Props) => {
  const cardStyle = {
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
  } satisfies ViewStyle;

  const overlayOpacity = (() => {
    if (props.draggable) {
      return 0;
    }

    if (props.correctlyPlaced) {
      return 0.5;
    }

    return 0.3;
  })();

  const overlayStyle = {
    backgroundColor: "#000",
    borderRadius: ComputedSettings.instance.borderRadius,
    height: props.cardSize.height,
    opacity: overlayOpacity,
    position: "absolute",
    width: props.cardSize.width,
  } satisfies ViewStyle;

  const shadowStyle = {
    borderRadius: ComputedSettings.instance.borderRadius,
    height: props.cardSize.height,
    shadowColor: props.dragging ? Settings.colors.card.shadowColor : undefined,
    shadowOffset: props.dragging
      ? ComputedSettings.instance.cardShadowOffset
      : undefined,
    shadowOpacity: props.dragging ? Settings.cardShadowOpacity : undefined,
    shadowRadius: props.dragging
      ? ComputedSettings.instance.cardShadowRadius
      : undefined,
    width: props.cardSize.width,
  } satisfies ViewStyle;

  const suitStyle = {
    bottom: Math.round(0.1 * props.cardSize.width),
    position: "absolute",
    right: Math.round(0.025 * props.cardSize.width),
  } satisfies ViewStyle;

  const valueStyle = {
    color: SuitHelper.getColor(props.card.suit),
    fontFamily: "Arabian-onenightstand",
    fontSize: Math.round(0.7 * props.cardSize.width),
    fontWeight: "700",
    left: Math.round(0.04 * props.cardSize.width),
    letterSpacing: -Math.round(0.07 * props.cardSize.width),
    position: "absolute",
    textAlign: "left",
    top: -Math.round(0.08 * props.cardSize.width),
    width: Math.round(1.22 * props.cardSize.width),
  } satisfies TextStyle;

  return (
    <View style={shadowStyle}>
      <View style={cardStyle}>
        <Text style={valueStyle}>{props.card.displayValue}</Text>
        <View style={suitStyle}>
          <SuitView
            size={Math.round(0.55 * props.cardSize.width)}
            suit={props.card.suit}
          />
        </View>
      </View>
      <View style={overlayStyle} />
    </View>
  );
});
