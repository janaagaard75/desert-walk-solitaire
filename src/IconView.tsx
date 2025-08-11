import {
  Entypo,
  FontAwesome,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { observer } from "mobx-react-lite";
import { IconName } from "./IconName";

const iconSize = 20;

interface Props {
  color: string;
  iconName: IconName;
}

export const IconView = observer((props: Props) => {
  switch (props.iconName) {
    case "controller-fast-forward":
    case "shuffle":
      return (
        <Entypo
          color={props.color}
          name={props.iconName}
          size={iconSize}
        />
      );

    case "fast-backward":
      return (
        <FontAwesome
          color={props.color}
          name={props.iconName}
          size={iconSize}
        />
      );

    case "redo":
    case "undo":
      return (
        <MaterialCommunityIcons
          color={props.color}
          name={props.iconName}
          size={iconSize}
        />
      );
  }
});
