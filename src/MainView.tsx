import { loadAsync } from "expo-font";
import { lockAsync, OrientationLock } from "expo-screen-orientation";
import * as SplashScreen from "expo-splash-screen";
import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  Image,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import appJson from "../app.json";
import "./ArrayExtensions";
import { FooterView } from "./FooterView";
import { GridView } from "./GridView";
import { ComputedSettings } from "./model/ComputedSettings";
import { Settings } from "./model/Settings";

// Keep the splash screen visible while we fetch resources.
// eslint-disable-next-line @typescript-eslint/no-floating-promises
SplashScreen.preventAutoHideAsync();

export const MainView = observer(() => {
  const [fontLoaded, setFontLoaded] = useState(false);
  const [versionNumberVisible, setVersionNumberVisible] = useState(false);

  useEffect(() => {
    lockAsync(OrientationLock.LANDSCAPE);

    updateWindowSize();
    Dimensions.addEventListener("change", () => {
      updateWindowSize();
    });

    loadFont();
  }, []);

  const loadFont = async () => {
    await loadAsync({
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
        backgroundColor: Settings.colors.mainBackgroundColor,
        flex: 1,
        flexDirection: "column",
        position: "relative",
      }}
    >
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
          <Image
            source={require("../assets/50713-transparent.png")}
            style={{
              backgroundColor: Settings.colors.gridBackgroundColor,
              height: ComputedSettings.instance.windowSize.height,
              position: "absolute",
              resizeMode: "repeat",
              width: ComputedSettings.instance.windowSize.width,
            }}
          />
          <GridView />
        </View>
      </TouchableWithoutFeedback>
      <FooterView />
      {ComputedSettings.isIosWithoutHomeButton() ? (
        <View
          style={{
            height: 15,
          }}
        />
      ) : undefined}
      <Text
        style={{
          color: "#fff",
          display: versionNumberVisible ? "flex" : "none",
          fontSize: 9,
          right: 30,
          position: "absolute",
          top: 2,
        }}
      >
        Version: {appJson.expo.version}
      </Text>
    </View>
  );

  // TODO: When replaying a finished game, the animation pauses a bit after replaying a shuffle turn.
  // TODO: Fix resizing when rotating the iPad.
});

const updateWindowSize = () => {
  const windowSize = Dimensions.get("window");
  ComputedSettings.instance.windowSize = {
    height: windowSize.height,
    width: windowSize.width,
  };
};
