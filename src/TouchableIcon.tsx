import {
  Entypo,
  FontAwesome,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
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
  if (props.state === "hidden") {
    return <View style={{ width: `${width}%` }} />;
  }

  const color = props.state === "enabled" ? "#fff" : "#999";
  const shadowOpacity = props.state === "enabled" ? 0.5 : 0;

  return (
    <TouchableOpacity
      onPress={props.handlePress}
      disabled={props.state === "disabled"}
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
