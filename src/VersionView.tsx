import { Text } from "react-native";
import packageJson from "../package.json";

interface Props {
  versionNumberVisible: boolean;
}

export const VersionView = (props: Props) => (
  <Text
    style={{
      color: "#fff",
      display: props.versionNumberVisible ? "flex" : "none",
      fontSize: 9,
      position: "absolute",
      right: 30,
      top: 2,
    }}
  >
    Version: {packageJson.version}
  </Text>
);
