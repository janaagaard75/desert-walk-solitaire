import {
  Entypo,
  FontAwesome,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import React from "react";
import { TouchableOpacity, View } from "react-native";
import { TouchableState } from "./model/TouchableState";

type IconName =
  | "controller-fast-forward"
  | "fast-backward"
  | "redo"
  | "shuffle"
  | "undo";

interface Props {
  handlePress: () => void;
  iconName: IconName;
  state: TouchableState;
}

const numberOfIcons = 7;
const width = (1 / numberOfIcons) * 100;
const iconSize = 20;

export const TouchableIcon = (props: Props) => {
  if (props.state === TouchableState.Hidden) {
    return <View style={{ width: `${width}%` }} />;
  }

  const color = props.state === TouchableState.Enabled ? "#fff" : "#999";
  const shadowOpacity = props.state === TouchableState.Enabled ? 0.5 : 0;

  return (
    <TouchableOpacity
      onPress={props.handlePress}
      disabled={props.state === TouchableState.Disabled}
      style={{
        alignItems: "center",
        alignSelf: "center",
        backgroundColor: "transparent",
        shadowColor: "#fff",
        shadowOpacity: shadowOpacity,
        shadowRadius: 5,
        width: `${width}%`,
      }}
    >
      {renderIcon(props.iconName, color)}
    </TouchableOpacity>
  );
};

const renderIcon = (iconName: IconName, color: string): JSX.Element => {
  switch (iconName) {
    case "controller-fast-forward":
    case "shuffle":
      return <Entypo color={color} name={iconName} size={iconSize} />;

    case "fast-backward":
      return <FontAwesome color={color} name={iconName} size={iconSize} />;

    case "redo":
    case "undo":
      return (
        <MaterialCommunityIcons color={color} name={iconName} size={iconSize} />
      );
  }
};
