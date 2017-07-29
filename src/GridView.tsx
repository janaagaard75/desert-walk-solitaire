import * as React from 'react'
import { Component } from 'react'
import { observer } from 'mobx-react'
import { View } from 'react-native'
import { ViewStyle } from 'react-native'

import { Cell } from './Cell'
import { CellView } from './CellView'
import { Grid } from './Grid'
import { Position } from './Position'
import { Rectangle } from './Rectangle'
import { Size } from './Size'

interface Props {
  availableSize: Size
  grid: Grid
}

@observer
export class GridView extends Component<Props, {}> {
  constructor(props: Props, context?: any) {
    super(props, context)

    this.cellSize = this.getCellSize()
    this.spaceBetweenCells = this.getSpaceBetweenCells()
  }

  private readonly cardSizeToSpaceRatio = 10 / 1
  private readonly cellSize: Size
  private readonly heightToWidthRatio = 3 / 2
  private readonly spaceBetweenCells: number

  public render() {
    const gridViewStyle: ViewStyle = {
      flex: 1,
      position: 'relative'
    }

    return (
      <View
        style={gridViewStyle}
      >
        {this.props.grid.cells.map(cell =>
          <CellView
            cell={cell}
            key={cell.key}
            onCardDropped={(fromCell, center) => this.handleCardDropped(fromCell, center)}
            position={this.getCellPosition(cell.columnIndex, cell.rowIndex)}
            size={this.cellSize}
          />
        )}
      </View>
    )
  }

  private getCellBundary(cell: Cell): Rectangle {
    const cellPosition = this.getCellPosition(cell.columnIndex, cell.rowIndex)

    const boundary = new Rectangle(
      {
        left: cellPosition.left,
        top: cellPosition.top
      },
      {
        left: cellPosition.left + this.cellSize.width,
        top: cellPosition.top + this.cellSize.height
      }
    )

    return boundary
  }

  private getCellPosition(columnIndex: number, rowIndex: number): Position {
    const position = {
      left: this.spaceBetweenCells + columnIndex * (this.cellSize.width + this.spaceBetweenCells),
      top: this.spaceBetweenCells + rowIndex * (this.cellSize.height + this.spaceBetweenCells)
    }

    return position
  }

  private getCellSize(): Size {
    const cellWidth = Math.floor(
      (
        this.cardSizeToSpaceRatio * this.props.availableSize.width
      ) / (
        this.props.grid.columns * (this.cardSizeToSpaceRatio + 1) + 1
      )
    )

    const cellHeight = Math.floor(this.heightToWidthRatio * cellWidth)

    return {
      height: cellHeight,
      width: cellWidth
    }
  }

  public getSpaceBetweenCells(): number {
    const availableWidthForSpaces = this.props.availableSize.width - this.props.grid.columns * this.cellSize.width
    const spaceBetweenCells = Math.floor(availableWidthForSpaces / (this.props.grid.columns + 1))
    return spaceBetweenCells
  }

  private handleCardDropped(fromCell: Cell, center: Position) {
    this.props.grid.emptyCells.forEach(cell => {
      if (this.getCellBundary(cell).pointIsWithinBoundary(center)) {
        this.props.grid.moveCard(fromCell, cell)
      }
    })
  }
}