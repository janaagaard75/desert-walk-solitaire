import { SafeAreaProvider } from "react-native-safe-area-context";
import { MainView } from "./MainView";

export default function App() {
  return (
    <SafeAreaProvider>
      <MainView />
    </SafeAreaProvider>
  );
}
