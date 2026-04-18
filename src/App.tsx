import { SafeAreaProvider } from "react-native-safe-area-context";
import { FontLoaderView } from "./FontLoaderView";
import { MainView } from "./MainView";

export default function App() {
  return (
    <SafeAreaProvider>
      <FontLoaderView>
        <MainView />
      </FontLoaderView>
    </SafeAreaProvider>
  );
}
