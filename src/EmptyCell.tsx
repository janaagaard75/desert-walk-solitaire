import * as React from 'react'
import { Component } from 'react'
import { observer } from 'mobx-react'
import { View } from 'react-native'
import { ViewStyle } from 'react-native'

import { EmptyCellStatus } from './EmptyCellStatus'
import { Point } from './Point'
import { Size } from './Size'

interface Props {
  position: Point
  size: Size
  status: EmptyCellStatus
}

@observer
export class EmptyCell extends Component<Props, {}> {
  public render() {
    const [color, style, width] = this.getBorderColorStyleAndWidth()

    const emptyCellStyle: ViewStyle = {
      borderColor: color,
      borderRadius: Math.floor(this.props.size.width / 41 * 5),
      borderStyle: style,
      borderWidth: width,
      height: this.props.size.height,
      left: this.props.position.x,
      position: 'absolute',
      top: this.props.position.y,
      width: this.props.size.width
    }

    return (
      <View
        style={emptyCellStyle}
      />
    )
  }

  private getBorderColorStyleAndWidth(): [string | undefined, 'solid' | 'dotted' | 'dashed' | undefined, number] {
    switch (this.props.status) {
      case EmptyCellStatus.Blocked:
        return [undefined, undefined, 0]

      case EmptyCellStatus.CurrentlyDraggedCardDroppable:
        return ['white', 'dashed', Math.floor(this.props.size.width / 41 * 3)]

      case EmptyCellStatus.DropAllowedAndNoCardIsBeingDragged:
      case EmptyCellStatus.DropAllowedButNotCurrentlyDraggedCard:
        return ['black', 'dashed', Math.floor(this.props.size.width / 41 * 3)]

      case EmptyCellStatus.HoveredByDropableCard:
        return ['white', 'solid', Math.floor(this.props.size.width / 41 * 3)]
    }
  }
}