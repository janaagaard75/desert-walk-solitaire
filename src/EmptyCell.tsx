import * as React from 'react'
import { Component } from 'react'
import { View } from 'react-native'
import { ViewStyle } from 'react-native'

interface Props {
  height: number
  positionX: number
  positionY: number
  width: number
}

export class EmptyCell extends Component<Props, {}> {
  public render() {
    const emptyCellStyle: ViewStyle = {
      borderColor: 'black',
      borderRadius: 5,
      borderWidth: 1,
      height: this.props.height,
      left: this.props.positionX,
      position: 'absolute',
      top: this.props.positionY,
      width: this.props.width
    }

    return (
      <View
        style={emptyCellStyle}
      />
    )
  }
}