import * as React from 'react'
import { Component } from 'react'
import { View } from 'react-native'
import { ViewStyle } from 'react-native'

import { Position } from './Position'

interface Props {
  height: number
  position: Position
  width: number
}

export class EmptyCell extends Component<Props, {}> {
  public render() {
    const emptyCellStyle: ViewStyle = {
      borderColor: 'black',
      borderRadius: 5,
      borderWidth: 1,
      height: this.props.height,
      left: this.props.position.left,
      position: 'absolute',
      top: this.props.position.top,
      width: this.props.width
    }

    return (
      <View
        style={emptyCellStyle}
      />
    )
  }
}