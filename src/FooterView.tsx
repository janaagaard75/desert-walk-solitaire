import { observer } from "mobx-react"
import * as React from "react"
import { Component } from "react"
import { Alert, View, ViewStyle } from "react-native"
import { Game } from "./model/Game"
import { GameState } from "./model/GameState"
import { Settings } from "./model/Settings"
import { TouchableState } from "./model/TouchableState"
import { TouchableIcon } from "./TouchableIcon"

@observer
export class FooterView extends Component {
  public render() {
    const buttonWrapperStyle: ViewStyle = {
      backgroundColor: Settings.colors.mainBackgroundColor,
      flexDirection: "row",
      flexWrap: "wrap"
    }

    return (
      <View
        style={{
          backgroundColor: Settings.colors.mainBackgroundColor,
          paddingBottom: 14, // Tweaked manually to make it fit.
          paddingTop: 4
        }}
      >
        <View style={buttonWrapperStyle}>
          <TouchableIcon
            handlePress={() => this.confirmUnlessGameOver()}
            iconGroup="fontAwesome"
            iconName="fast-backward"
            state={TouchableState.Enabled}
          />
          <TouchableIcon
            handlePress={() => Game.instance.replay()}
            iconGroup="entypo"
            iconName="controller-fast-forward"
            state={
              Game.instance.replayEnabled
                ? TouchableState.Enabled
                : TouchableState.Hidden
            }
          />
          <TouchableIcon
            handlePress={() => Game.instance.shuffleCardsInIncorrectPosition()}
            iconGroup="entypo"
            iconName="shuffle"
            state={this.shuffleButtonEnabled(1)}
          />
          <TouchableIcon
            handlePress={() => Game.instance.shuffleCardsInIncorrectPosition()}
            iconGroup="entypo"
            iconName="shuffle"
            state={this.shuffleButtonEnabled(2)}
          />
          <TouchableIcon
            handlePress={() => Game.instance.shuffleCardsInIncorrectPosition()}
            iconGroup="entypo"
            iconName="shuffle"
            state={this.shuffleButtonEnabled(3)}
          />
          <TouchableIcon
            handlePress={() => Game.instance.undo()}
            iconGroup="ionicons"
            iconName="md-undo"
            state={Game.instance.undoState}
          />
          <TouchableIcon
            handlePress={() => Game.instance.redo()}
            iconGroup="ionicons"
            iconName="md-redo"
            state={Game.instance.redoState}
          />
        </View>
      </View>
    )
  }

  private confirmUnlessGameOver() {
    switch (Game.instance.gameState) {
      case GameState.Lost:
      case GameState.Won:
        Game.instance.startOver()
        break

      case GameState.MovePossible:
      case GameState.Stuck:
        this.confirmRestart()
        break

      default:
        throw new Error(
          `The game state ${Game.instance.gameState} is not supported.`
        )
    }
  }

  private confirmRestart() {
    Alert.alert(
      "Start over?",
      "This game isn't over yet. Start over anyway?",
      [
        {
          style: "cancel",
          text: "No, let me continue this game"
        },
        {
          onPress: () => Game.instance.startOver(),
          style: "destructive",
          text: "Yes, start over"
        }
      ],
      { cancelable: false }
    )
  }

  private shuffleButtonEnabled(buttonNumber: number): TouchableState {
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
}
