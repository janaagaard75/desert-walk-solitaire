import * as React from 'react'
import { Component } from 'react'
import { observer } from 'mobx-react'
import { View } from 'react-native'
import { ViewStyle } from 'react-native'

import { EmptyCell } from './EmptyCell'
import { EmptyCellStatus } from './EmptyCellStatus'
import { Settings } from './Settings'

interface Props {
  emptyCell: EmptyCell
}

@observer
export class EmptyCellView extends Component<Props, {}> {
  public render() {
    const [color, style, width] = this.getBorderColorStyleAndWidth()

    const emptyCellStyle: ViewStyle = {
      borderColor: color,
      borderRadius: Settings.instance.borderRadius,
      borderStyle: style,
      borderWidth: width,
      height: Settings.instance.cardSize.height,
      left: this.props.emptyCell.cell.position.x,
      position: 'absolute',
      top: this.props.emptyCell.cell.position.y,
      width: Settings.instance.cardSize.width,
    }

    return (
      <View
        style={emptyCellStyle}
      />
    )
  }

  private getBorderColorStyleAndWidth(): [string | undefined, 'solid' | 'dotted' | 'dashed' | undefined, number] {
    switch (this.props.emptyCell.status) {
      case EmptyCellStatus.Blocked:
        return [undefined, undefined, 0]

      case EmptyCellStatus.TargetableCellButNotMostOverlapped:
        return ['white', 'dashed', Settings.instance.borderWidth]

      case EmptyCellStatus.DropAllowedButNoCardIsBeingDragged:
      case EmptyCellStatus.DropAllowedButNotTargetableCell:
        return ['black', 'dashed', Settings.instance.borderWidth]

      case EmptyCellStatus.MostOverlappedTargetableCell:
        return ['white', 'solid', Settings.instance.borderWidth]
    }
  }
}