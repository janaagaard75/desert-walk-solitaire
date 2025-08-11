import { observer } from "mobx-react-lite";
import { TouchableOpacity, View } from "react-native";
import { IconView } from "./IconView";
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

export const TouchableIcon = observer((props: Props) => {
  if (props.state === "hidden") {
    return <View style={{ width: `${width}%` }} />;
  }

  const color = props.state === "enabled" ? "#fff" : "#999";
  const shadowOpacity = props.state === "enabled" ? 0.5 : 0;

  return (
    <TouchableOpacity
      disabled={props.state === "disabled"}
      onPress={props.handlePress}
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
      <IconView
        color={color}
        iconName={props.iconName}
      />
    </TouchableOpacity>
  );
});
