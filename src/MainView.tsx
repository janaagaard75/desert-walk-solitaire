import AppLoading from "expo-app-loading"
import { loadAsync } from "expo-font"
import { lockAsync, OrientationLock } from "expo-screen-orientation"
import { observer } from "mobx-react"
import React, { useEffect, useState } from "react"
import {
  Dimensions,
  Image,
  Text,
  TouchableWithoutFeedback,
  View,
  ViewStyle,
} from "react-native"
import appJson from "../app.json"
import "./ArrayExtensions"
import { FooterView } from "./FooterView"
import { GridView } from "./GridView"
import { ComputedSettings } from "./model/ComputedSettings"
import { Settings } from "./model/Settings"

interface Props {}

export const MainView = observer(() => {
  useEffect(() => {
    void lockAsync(OrientationLock.LANDSCAPE)

    updateWindowSize()
    Dimensions.addEventListener("change", () => {
      updateWindowSize()
    })
  }, [])

  const [fontLoaded, setFontLoaded] = useState(false)
  const [showVersionNumber, setShowVersionNumber] = useState(false)

  const mainViewStyle: ViewStyle = {
    backgroundColor: Settings.colors.mainBackgroundColor,
    flex: 1,
    flexDirection: "column",
    position: "relative",
  }

  const gridWrapperStyle: ViewStyle = {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  }

  if (!fontLoaded) {
    return (
      <AppLoading
        startAsync={() => loadFont()}
        onFinish={() => {
          setFontLoaded(true)
        }}
        onError={console.warn}
      />
    )
  }

  return (
    <View style={mainViewStyle}>
      <TouchableWithoutFeedback
        delayLongPress={5 * 1000}
        onLongPress={() => setShowVersionNumber(true)}
      >
        <View style={gridWrapperStyle}>
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
          display: showVersionNumber ? "flex" : "none",
          fontSize: 9,
          right: 30,
          position: "absolute",
          top: 2,
        }}
      >
        Version: {appJson.expo.version}
      </Text>
    </View>
  )
})

const loadFont = async () => {
  await loadAsync({
    "Arabian-onenightstand": require("../assets/xxii-arabian-onenightstand/xxii-arabian-onenightstand.ttf"),
  })
}

// TODO: When replaying a finished game, the animation pauses a bit after replaying a shuffle turn.
// TODO: Fix resizing when rotating the iPad.
const updateWindowSize = () => {
  const windowSize = Dimensions.get("window")
  ComputedSettings.instance.windowSize = {
    height: windowSize.height,
    width: windowSize.width,
  }
}
