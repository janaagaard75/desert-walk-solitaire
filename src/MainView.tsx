import * as Font from "expo-font"
import * as React from "react"
import { AppLoading } from "expo"
import { Component } from "react"
import { Dimensions, TouchableWithoutFeedback } from "react-native"
import { Image } from "react-native"
import { isIphoneX } from "react-native-iphone-x-helper"
import { observable } from "mobx"
import { observer } from "mobx-react"
import { ScreenOrientation } from "expo"
import { View } from "react-native"
import { ViewStyle } from "react-native"

import "./ArrayExtensions"
import { FooterView } from "./FooterView"
import { GridView } from "./GridView"
import { Settings } from "./model/Settings"

@observer
export default class MainView extends Component {
  public constructor(props: {}, context?: any) {
    super(props, context)

    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE)
    this.updateWindowSize()
    Dimensions.addEventListener("change", () => {
      this.updateWindowSize()
    })
  }

  @observable
  private fontLoaded: boolean = false

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
        <TouchableWithoutFeedback onLongPress={() => this.showVersionNumber()}>
          <View style={this.getGridWrapperStyle()}>
            <Image
              source={require("./50713-transparent.png")}
              style={{
                backgroundColor: Settings.instance.colors.gridBackgroundColor,
                height: Settings.instance.windowSize.height,
                position: "absolute",
                resizeMode: "repeat",
                width: Settings.instance.windowSize.width
              }}
            />
            <GridView />
          </View>
        </TouchableWithoutFeedback>
        <FooterView />
        {isIphoneX() ? (
          <View
            style={{
              height: 15
            }}
          />
        ) : (
          undefined
        )}
      </View>
    )
  }

  private showVersionNumber(): void {}

  private getGridWrapperStyle(): ViewStyle {
    return {
      alignItems: "center",
      flex: 1,
      justifyContent: "center"
    }
  }

  private getMainStyle(): ViewStyle {
    return {
      backgroundColor: Settings.instance.colors.mainBackgroundColor,
      flex: 1,
      flexDirection: "column"
    }
  }

  private async loadFont() {
    await Font.loadAsync({
      "Arabian-onenightstand": require("../assets/xxii-arabian-onenightstand/xxii-arabian-onenightstand.ttf")
    })
  }

  private updateWindowSize() {
    const windowSize = Dimensions.get("window")
    Settings.instance.windowSize = {
      height: windowSize.height,
      width: windowSize.width
    }
  }
}
