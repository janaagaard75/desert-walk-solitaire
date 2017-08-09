import * as React from 'react'
import { Component } from 'react'
import { observer } from 'mobx-react'
import { View } from 'react-native'
import { ViewStyle } from 'react-native'

import { Card } from './Card'
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

interface State {
  draggedCard: Card | undefined
}

@observer
export class GridView extends Component<Props, State> {
  constructor(props: Props, context?: any) {
    super(props, context)

    this.state = {
      draggedCard: undefined
    }

    this.cellSize = this.getCellSize()
    this.gutter = this.getGutter()
  }

  private readonly cardSizeRatio = 3 / 2
  private readonly cardWidthToGutterRatio = 7 / 1
  private readonly cellSize: Size
  private readonly gutter: number

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
            draggedCard={this.state.draggedCard}
            isDraggable={this.props.grid.draggableCards.some(card => cell.card === card)}
            key={cell.key}
            onCardDropped={(fromCell, cardCenter) => this.handleCardDropped(fromCell, cardCenter)}
            onCardMoved={(card, cardCenter) => this.handleCardMoved(card, cardCenter)}
            onDragStarted={card => this.handleDragStarted(card)}
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
      cellPosition.x,
      cellPosition.x + this.cellSize.width,
      cellPosition.y,
      cellPosition.y + this.cellSize.height
    )

    return boundary
  }

  private getCellPosition(columnIndex: number, rowIndex: number): Position {
    const position = {
      x: this.gutter + columnIndex * (this.cellSize.width + this.gutter),
      y: this.gutter + rowIndex * (this.cellSize.height + this.gutter)
    }

    return position
  }

  private getCellSize(): Size {
    const cellWidth = Math.floor(
      (
        this.props.availableSize.width * this.cardWidthToGutterRatio
      ) / (
        this.props.grid.columns * (this.cardWidthToGutterRatio + 1) + 1
      )
    )

    const cellHeight = Math.floor(this.cardSizeRatio * cellWidth)

    // TODO: Verify that there is enough available height.

    return {
      height: cellHeight,
      width: cellWidth
    }
  }

  public getGutter(): number {
    const gutter = Math.floor(
      (
        this.props.availableSize.width - this.props.grid.columns * this.cellSize.width
      ) / this.props.grid.columns
    )

    return gutter
  }

  private handleCardDropped(fromCell: Cell, cardCenter: Position) {
    this.props.grid.emptyCells.forEach(cell => {
      if (this.getCellBundary(cell).pointIsWithinBoundary(cardCenter)
        && this.props.grid.cardIsDroppable(fromCell.card as Card, cell)
      ) {
        this.props.grid.moveCard(fromCell, cell)
      }
    })

    this.setState({
      draggedCard: undefined
    })
  }

  private handleCardMoved(card: Card, cardCenter: Position) {
    this.props.grid.emptyCells.forEach(cell => {
      cell.hoveredByCard = this.getCellBundary(cell).pointIsWithinBoundary(cardCenter)
        ? cell.hoveredByCard = card
        : cell.hoveredByCard = undefined
    })
  }

  private handleDragStarted(card: Card) {
    this.setState({
      draggedCard: card
    })
  }
}