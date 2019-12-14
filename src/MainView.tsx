import { AppLoading, ScreenOrientation } from "expo"
import * as Font from "expo-font"
import { observable } from "mobx"
import { observer } from "mobx-react"
import * as React from "react"
import { Component } from "react"
import {
  Dimensions,
  Image,
  Text,
  TouchableWithoutFeedback,
  View,
  ViewStyle
} from "react-native"
import { isIphoneX } from "react-native-iphone-x-helper"
import appJson from "../app.json"
import "./ArrayExtensions"
import { FooterView } from "./FooterView"
import { GridView } from "./GridView"
import { ComputedSettings } from "./model/ComputedSettings"
import { Settings } from "./model/Settings"

@observer
export class MainView extends Component {
  public constructor(props: {}) {
    super(props)

    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE)
    this.updateWindowSize()
    Dimensions.addEventListener("change", () => {
      this.updateWindowSize()
    })
  }

  @observable private fontLoaded = false
  @observable private showVersionNumber = false

  public render() {
    if (!this.fontLoaded) {
      return (
        <AppLoading
          startAsync={() => this.loadFont()}
          onFinish={() => {
            this.fontLoaded = true
          }}
        />
      )
    }

    return (
      <View style={this.getMainStyle()}>
        <TouchableWithoutFeedback
          delayLongPress={5 * 1000}
          onLongPress={() => (this.showVersionNumber = true)}
        >
          <View style={this.getGridWrapperStyle()}>
            <Image
              source={require("./50713-transparent.png")}
              style={{
                backgroundColor: Settings.colors.gridBackgroundColor,
                height: ComputedSettings.instance.windowSize.height,
                position: "absolute",
                resizeMode: "repeat",
                width: ComputedSettings.instance.windowSize.width
              }}
            />
            <GridView />
          </View>
        </TouchableWithoutFeedback>
        <FooterView />
        {/* TODO: Bigger gutter if iPhone X or iPad Pro. */}
        {isIphoneX() ? (
          <View
            style={{
              height: 15
            }}
          />
        ) : (
          undefined
        )}
        <Text
          style={{
            color: "#fff",
            display: this.showVersionNumber ? "flex" : "none",
            fontSize: 9,
            right: 30,
            position: "absolute",
            top: 2
          }}
        >
          Version: {this.versionNumber}
        </Text>
      </View>
    )
  }

  private get versionNumber(): string {
    return appJson.expo.version
  }

  private getGridWrapperStyle(): ViewStyle {
    return {
      alignItems: "center",
      flex: 1,
      justifyContent: "center"
    }
  }

  private getMainStyle(): ViewStyle {
    return {
      backgroundColor: Settings.colors.mainBackgroundColor,
      flex: 1,
      flexDirection: "column",
      position: "relative"
    }
  }

  private async loadFont() {
    await Font.loadAsync({
      "Arabian-onenightstand": require("../assets/xxii-arabian-onenightstand/xxii-arabian-onenightstand.ttf")
    })
  }

  private updateWindowSize() {
    const windowSize = Dimensions.get("window")
    ComputedSettings.instance.windowSize = {
      height: windowSize.height,
      width: windowSize.width
    }
  }
}
