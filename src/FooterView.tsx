import { observer } from "mobx-react-lite";
import { Alert, View } from "react-native";
import { Game } from "./model/Game";
import { Settings } from "./model/Settings";
import { TouchableState } from "./model/TouchableState";
import { TouchableIconView } from "./TouchableIconView";

export const FooterView = observer(() => {
  const confirmRestart = () => {
    Alert.alert(
      "Start over?",
      "This game isn't over yet. Start over anyway?",
      [
        {
          style: "cancel",
          text: "No, let me continue this game",
        },
        {
          onPress: () => {
            Game.instance.startOver();
          },
          style: "destructive",
          text: "Yes, start over",
        },
      ],
      {
        cancelable: false,
      },
    );
  };

  const confirmUnlessGameOver = (): void => {
    switch (Game.instance.gameState) {
      case "lost":
      case "won":
        Game.instance.startOver();
        break;

      case "movePossible":
      case "shufflePossible":
        confirmRestart();
        break;
    }
  };

  const shuffleButtonEnabled = (buttonNumber: number): TouchableState => {
    const buttonNumberToEnable = Game.instance.shuffles + 1;

    if (buttonNumber < buttonNumberToEnable) {
      return "hidden";
    }

    if (
      buttonNumber === buttonNumberToEnable
      && Game.instance.gameState === "shufflePossible"
    ) {
      return "enabled";
    }

    return "disabled";
  };

  return (
    <View
      style={{
        backgroundColor: Settings.colors.mainBackgroundColor,
        paddingBottom: 14, // Tweaked manually to make it fit.
        paddingTop: 4,
      }}
    >
      <View
        style={{
          backgroundColor: Settings.colors.mainBackgroundColor,
          flexDirection: "row",
          flexWrap: "wrap",
        }}
      >
        <TouchableIconView
          handlePress={confirmUnlessGameOver}
          iconName="fast-backward"
          state={"enabled"}
        />
        <TouchableIconView
          handlePress={() => {
            Game.instance.replay();
          }}
          iconName="controller-fast-forward"
          state={Game.instance.replayEnabled ? "enabled" : "hidden"}
        />
        <TouchableIconView
          handlePress={() => {
            Game.instance.shuffleCardsInIncorrectPosition();
          }}
          iconName="shuffle"
          state={shuffleButtonEnabled(1)}
        />
        <TouchableIconView
          handlePress={() => {
            Game.instance.shuffleCardsInIncorrectPosition();
          }}
          iconName="shuffle"
          state={shuffleButtonEnabled(2)}
        />
        <TouchableIconView
          handlePress={() => {
            Game.instance.shuffleCardsInIncorrectPosition();
          }}
          iconName="shuffle"
          state={shuffleButtonEnabled(3)}
        />
        <TouchableIconView
          handlePress={() => {
            Game.instance.undo();
          }}
          iconName="undo"
          state={Game.instance.undoState}
        />
        <TouchableIconView
          handlePress={() => {
            Game.instance.redo();
          }}
          iconName="redo"
          state={Game.instance.redoState}
        />
      </View>
    </View>
  );
});
