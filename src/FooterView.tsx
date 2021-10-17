import { observer } from "mobx-react"
import React from "react"
import { Alert, View, ViewStyle } from "react-native"
import { Game } from "./model/Game"
import { GameState } from "./model/GameState"
import { Settings } from "./model/Settings"
import { TouchableState } from "./model/TouchableState"
import { TouchableIcon } from "./TouchableIcon"

export const FooterView = observer(() => {
  const buttonWrapperStyle: ViewStyle = {
    backgroundColor: Settings.colors.mainBackgroundColor,
    flexDirection: "row",
    flexWrap: "wrap",
  }

  return (
    <View
      style={{
        backgroundColor: Settings.colors.mainBackgroundColor,
        paddingBottom: 14, // Tweaked manually to make it fit.
        paddingTop: 4,
      }}
    >
      <View style={buttonWrapperStyle}>
        <TouchableIcon
          handlePress={confirmUnlessGameOver}
          iconName="fast-backward"
          state={TouchableState.Enabled}
        />
        <TouchableIcon
          handlePress={() => Game.instance.replay()}
          iconName="controller-fast-forward"
          state={
            Game.instance.replayEnabled
              ? TouchableState.Enabled
              : TouchableState.Hidden
          }
        />
        <TouchableIcon
          handlePress={() => Game.instance.shuffleCardsInIncorrectPosition()}
          iconName="shuffle"
          state={shuffleButtonEnabled(1)}
        />
        <TouchableIcon
          handlePress={() => Game.instance.shuffleCardsInIncorrectPosition()}
          iconName="shuffle"
          state={shuffleButtonEnabled(2)}
        />
        <TouchableIcon
          handlePress={() => Game.instance.shuffleCardsInIncorrectPosition()}
          iconName="shuffle"
          state={shuffleButtonEnabled(3)}
        />
        <TouchableIcon
          handlePress={() => Game.instance.undo()}
          iconName="undo"
          state={Game.instance.undoState}
        />
        <TouchableIcon
          handlePress={() => Game.instance.redo()}
          iconName="redo"
          state={Game.instance.redoState}
        />
      </View>
    </View>
  )
})

const confirmUnlessGameOver = (): void => {
  switch (Game.instance.gameState) {
    case GameState.Lost:
    case GameState.Won:
      Game.instance.startOver()
      break

    case GameState.MovePossible:
    case GameState.Stuck:
      confirmRestart()
      break
  }
}

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
        onPress: () => Game.instance.startOver(),
        style: "destructive",
        text: "Yes, start over",
      },
    ],
    { cancelable: false }
  )
}

const shuffleButtonEnabled = (buttonNumber: number): TouchableState => {
  const buttonNumberToEnable = Game.instance.shuffles + 1

  if (buttonNumber < buttonNumberToEnable) {
    return TouchableState.Hidden
  }

  if (
    buttonNumber === buttonNumberToEnable &&
    Game.instance.gameState === GameState.Stuck
  ) {
    return TouchableState.Enabled
  }

  return TouchableState.Disabled
}
