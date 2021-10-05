import { Entypo, FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons"
import React, { Component } from "react"
import { TouchableOpacity, View } from "react-native"
import { TouchableState } from "./model/TouchableState"

type IconName =
  | "controller-fast-forward"
  | "fast-backward"
  | "redo"
  | "shuffle"
  | "undo"

interface Props {
  handlePress: () => void
  iconName: IconName
  state: TouchableState
}

export class TouchableIcon extends Component<Props> {
  public render() {
    const numberOfIcons = 7
    const width = (1 / numberOfIcons) * 100

    if (this.props.state === TouchableState.Hidden) {
      return <View style={{ width: `${width}%` }} />
    }

    const color = this.props.state === TouchableState.Enabled ? "#fff" : "#999"
    const shadowOpacity = this.props.state === TouchableState.Enabled ? 0.5 : 0

    return (
      <TouchableOpacity
        onPress={this.handlePress}
        disabled={this.props.state === TouchableState.Disabled}
        style={{
          alignItems: "center",
          alignSelf: "center",
          backgroundColor: "transparent",
          shadowColor: "#fff",
          shadowOpacity: shadowOpacity,
          shadowRadius: 5,
          width: `${width}%`,
        }}
      >
        {this.renderIcon(this.props.iconName, color)}
      </TouchableOpacity>
    )
  }

  private handlePress = () => {
    this.props.handlePress()
  }

  private renderIcon(iconName: IconName, color: string): JSX.Element {
    const iconSize = 20

    switch (iconName) {
      case "controller-fast-forward":
      case "shuffle":
        return <Entypo color={color} name={iconName} size={iconSize} />

      case "fast-backward":
        return <FontAwesome color={color} name={iconName} size={iconSize} />

      case "redo":
      case "undo":
        return (
          <MaterialCommunityIcons
            color={color}
            name={iconName}
            size={iconSize}
          />
        )
    }
  }
}
