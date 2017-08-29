import * as React from 'react'
import { Component } from 'react'
import { observer } from 'mobx-react'
import { View } from 'react-native'
import { ViewStyle } from 'react-native'

import { EmptyCellStatus } from './EmptyCellStatus'
import { Point } from './Point'
import { Settings } from './Settings'

interface Props {
  position: Point
  settings: Settings
  status: EmptyCellStatus
}

@observer
export class EmptyCell extends Component<Props, {}> {
  public render() {
    const [color, style, width] = this.getBorderColorStyleAndWidth()

    const emptyCellStyle: ViewStyle = {
      borderColor: color,
      borderRadius: this.props.settings.borderRadius,
      borderStyle: style,
      borderWidth: width,
      height: this.props.settings.cardSize.height,
      left: this.props.position.x,
      position: 'absolute',
      top: this.props.position.y,
      width: this.props.settings.cardSize.width
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
        return ['white', 'dashed', this.props.settings.borderWidth]

      case EmptyCellStatus.DropAllowedAndNoCardIsBeingDragged:
      case EmptyCellStatus.DropAllowedButNotCurrentlyDraggedCard:
        return ['black', 'dashed', this.props.settings.borderWidth]

      case EmptyCellStatus.HoveredByDropableCard:
        return ['white', 'solid', this.props.settings.borderWidth]
    }
  }
}