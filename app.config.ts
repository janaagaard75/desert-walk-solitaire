import { ConfigContext, ExpoConfig } from "expo/config";
import packageJson from "./package.json";

/** Full reference at https://docs.expo.dev/versions/latest/config/app/. */
const expoConfig = (_context: ConfigContext): ExpoConfig => ({
  android: {
    // Yes, janaagaard is misspelled here, but changing it requires publishing a different app.
    package: "com.janagaard.desertwalk",
  },
  description: "Solitaire card game.",
  extra: {
    eas: {
      projectId: "70b7bbb0-8039-11e7-b59b-8f3e0105197d",
    },
  },
  githubUrl: "https://github.com/janaagaard75/desert-walk",
  icon: "./assets/app-icon.png",
  ios: {
    bundleIdentifier: "com.janaagaard.desertwalk",
    config: {
      usesNonExemptEncryption: false,
    },
    requireFullScreen: true,
    supportsTablet: true,
    usesIcloudStorage: false,
  },
  name: "Desert Walk",
  orientation: "landscape",
  platforms: ["android", "ios"],
  plugins: ["expo-font"],
  primaryColor: "#446644",
  runtimeVersion: {
    policy: "sdkVersion",
  },
  slug: "desert-walk",
  splash: {
    backgroundColor: "#ffffff",
    hideExponentText: false,
    image: "./assets/splash-screen.png",
    resizeMode: "contain",
  },
  updates: {
    url: "https://u.expo.dev/70b7bbb0-8039-11e7-b59b-8f3e0105197d",
  },
  userInterfaceStyle: "light",
  version: packageJson.version,
});

export default expoConfig;
