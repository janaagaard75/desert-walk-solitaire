import { loadAsync } from "expo-font";
import { lockAsync, OrientationLock } from "expo-screen-orientation";
import * as SplashScreen from "expo-splash-screen";
import { autorun, makeObservable, observable } from "mobx";
import { observer } from "mobx-react";
import { Component } from "react";
import {
  Dimensions,
  Image,
  Text,
  TouchableWithoutFeedback,
  View,
  ViewStyle,
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

interface Props {}

@observer
export class MainView extends Component<Props> {
  public constructor(props: Props) {
    super(props);

    makeObservable<MainView, "fontLoaded" | "showVersionNumber">(this);

    void lockAsync(OrientationLock.LANDSCAPE);

    this.updateWindowSize();
    Dimensions.addEventListener("change", () => {
      this.updateWindowSize();
    });

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    this.loadFont();

    autorun(async () => {
      if (this.fontLoaded) {
        await SplashScreen.hideAsync();
      }
    });
  }

  @observable private fontLoaded = false;
  @observable private showVersionNumber = false;

  private mainViewStyle: ViewStyle = {
    backgroundColor: Settings.colors.mainBackgroundColor,
    flex: 1,
    flexDirection: "column",
    position: "relative",
  };

  private gridWrapperStyle: ViewStyle = {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  };

  public render() {
    if (!this.fontLoaded) {
      return null;
    }

    return (
      <View style={this.mainViewStyle}>
        <TouchableWithoutFeedback
          delayLongPress={5 * 1000}
          onLongPress={() => (this.showVersionNumber = true)}
        >
          <View style={this.gridWrapperStyle}>
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
            display: this.showVersionNumber ? "flex" : "none",
            fontSize: 9,
            right: 30,
            position: "absolute",
            top: 2,
          }}
        >
          Version: {this.versionNumber}
        </Text>
      </View>
    );
  }

  private get versionNumber(): string {
    return appJson.expo.version;
  }

  private async loadFont() {
    await loadAsync({
      "Arabian-onenightstand": require("../assets/xxii-arabian-onenightstand/xxii-arabian-onenightstand.ttf"),
    });
    this.fontLoaded = true;
  }

  // TODO: When replaying a finished game, the animation pauses a bit after replaying a shuffle turn.
  // TODO: Fix resizing when rotating the iPad.
  private updateWindowSize() {
    const windowSize = Dimensions.get("window");
    ComputedSettings.instance.windowSize = {
      height: windowSize.height,
      width: windowSize.width,
    };
  }
}
