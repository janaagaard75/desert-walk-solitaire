import { loadAsync } from "expo-font";
import { hideAsync } from "expo-splash-screen";
import { ReactNode, useEffect, useState } from "react";

interface Props {
  children: ReactNode;
}

export const FontLoaderView = (props: Props) => {
  const [fontLoaded, setFontLoaded] = useState(false);

  const loadFont = async () => {
    await loadAsync({
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-require-imports
      "Arabian-onenightstand": require("../assets/xxii-arabian-onenightstand/xxii-arabian-onenightstand.ttf"),
    });

    setFontLoaded(true);

    await hideAsync();
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadFont();
  }, []);

  if (!fontLoaded) {
    return <></>;
  }

  return <>{props.children}</>;
};
