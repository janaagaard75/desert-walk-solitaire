import { loadAsync } from "expo-font";
import { lockAsync, OrientationLock } from "expo-screen-orientation";
import * as SplashScreen from "expo-splash-screen";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import {
  Dimensions,
  Image,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { FooterView } from "./FooterView";
import { GridView } from "./GridView";
import { ComputedSettings } from "./model/ComputedSettings";
import { Settings } from "./model/Settings";
import { VersionView } from "./VersionView";

// Keep the splash screen visible while we fetch resources.
// eslint-disable-next-line @typescript-eslint/no-floating-promises
SplashScreen.preventAutoHideAsync();

export const MainView = observer(() => {
  const [fontLoaded, setFontLoaded] = useState(false);
  const [versionNumberVisible, setVersionNumberVisible] = useState(false);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    ComputedSettings.instance.setSafeAreaInsets(insets);
  }, [insets]);

  useEffect(() => {
    void lockAsync(OrientationLock.LANDSCAPE);

    updateWindowSize();
    Dimensions.addEventListener("change", () => {
      updateWindowSize();
    });

    void loadFont();
  }, []);

  const loadFont = async () => {
    await loadAsync({
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-require-imports
      "Arabian-onenightstand": require("../assets/xxii-arabian-onenightstand/xxii-arabian-onenightstand.ttf"),
    });

    setFontLoaded(true);

    await SplashScreen.hideAsync();
  };

  const showVersionNumber = () => {
    setVersionNumberVisible(true);
  };

  if (!fontLoaded) {
    return <></>;
  }

  return (
    <View
      style={{
        flex: 1,
        flexDirection: "column",
        paddingLeft: insets.left,
        paddingRight: insets.right,
        position: "relative",
      }}
    >
      <Image
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-require-imports
        source={require("../assets/50713-transparent.png")}
        style={{
          backgroundColor: Settings.colors.gridBackgroundColor,
          height: ComputedSettings.instance.windowSize.height,
          position: "absolute",
          resizeMode: "repeat",
          width: ComputedSettings.instance.windowSize.width,
        }}
      />
      <TouchableWithoutFeedback
        delayLongPress={5 * 1000}
        onLongPress={showVersionNumber}
      >
        <View
          style={{
            alignItems: "center",
            flex: 1,
            justifyContent: "center",
          }}
        >
          <GridView />
        </View>
      </TouchableWithoutFeedback>
      <FooterView />
      <VersionView versionNumberVisible={versionNumberVisible} />
    </View>
  );

  // TODO: When replaying a finished game, the animation pauses a bit after replaying a shuffle turn.
  // TODO: Fix resizing when rotating the iPad.
});

const updateWindowSize = () => {
  const windowSize = Dimensions.get("window");
  ComputedSettings.instance.setWindowSize({
    height: windowSize.height,
    width: windowSize.width,
  });
};
