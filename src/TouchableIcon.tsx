// tslint:disable:no-implicit-dependencies
import { Entypo, FontAwesome, Ionicons } from "@expo/vector-icons"
import * as React from "react"
import { Component } from "react"
import { TouchableOpacity, View } from "react-native"
// tslint:enable:no-implicit-dependencies
import { TouchableState } from "./model/TouchableState"

interface Props {
  handlePress: () => void
  iconGroup: string
  iconName: string
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
          width: `${width}%`
        }}
      >
        {this.renderIcon(this.props.iconGroup, this.props.iconName, color)}
      </TouchableOpacity>
    )
  }

  private handlePress = () => {
    this.props.handlePress()
  }

  private renderIcon(iconGroup: string, iconName: string, color: string) {
    const iconSize = 20

    switch (iconGroup) {
      case "entypo":
        return <Entypo color={color} name={iconName} size={iconSize} />

      case "fontAwesome":
        return <FontAwesome color={color} name={iconName} size={iconSize} />

      case "ionicons":
        return <Ionicons color={color} name={iconName} size={iconSize} />

      default:
        throw new Error(`The iconGroup '${iconGroup} is not supported.`)
    }
  }
}
