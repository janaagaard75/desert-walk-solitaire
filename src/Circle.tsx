import * as React from 'react'
import { Component } from 'react'
import { View } from 'react-native'
import { ViewStyle } from 'react-native'

interface Props {
  color: string
  left: number
  size: number
  top: number
}

export class Circle extends Component<Props, {}> {
  public render() {
    const style: ViewStyle = {
      backgroundColor: this.props.color,
      borderRadius: this.props.size / 2,
      height: this.props.size,
      left: this.props.left,
      opacity: 1,
      position: 'absolute',
      shadowColor: 'blue',
      shadowOffset: {
        height: 2,
        width: 1
      },
      shadowOpacity: 0.3,
      shadowRadius: 3,
      top: this.props.top,
      width: this.props.size
    }

    return (
      <View
        style={style}
      />
    )
  }
}