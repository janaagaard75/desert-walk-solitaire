import * as React from 'react'
import { Component } from 'react'
import { observer } from 'mobx-react'
import { View } from 'react-native'
import { ViewStyle } from 'react-native'

import { Card } from './Card'
import { Cell } from './Cell'
import { CellView } from './CellView'
import { Grid } from './Grid'
import { Point } from './Point'
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
            onCardDropped={(fromCell, cardRectangle) => this.handleCardDropped(fromCell, cardRectangle)}
            onCardMoved={(card, cardRectangle) => this.handleCardMoved(card, cardRectangle)}
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

  private getCellPosition(columnIndex: number, rowIndex: number): Point {
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

  private handleCardDropped(fromCell: Cell, cardRectangle: Rectangle) {
    if (this.state.draggedCard === undefined) {
      throw new Error('draggedCard should be defined when handling a drop.')
    }

    const overlappingEmptyCells = this.props.grid.emptyCells
      .filter(cell => this.props.grid.cardIsDroppable(this.state.draggedCard as Card, cell))
      .map(cell => {
        return {
          cell: cell,
          overlappingPixels: this.getCellBundary(cell).overlappingPixels(cardRectangle)
        }
      })
      .filter(cellAndOverlap => cellAndOverlap.overlappingPixels > 0)
      .sort((cellAndOverlap1, cellAndOverlap2) => cellAndOverlap2.overlappingPixels - cellAndOverlap1.overlappingPixels)

    if (overlappingEmptyCells.length > 0) {
      const toCell = overlappingEmptyCells[0].cell
      this.props.grid.moveCard(fromCell, toCell)
    }

    this.setState({
      draggedCard: undefined
    })
  }

  private handleCardMoved(card: Card, cardRectangle: Rectangle) {
    // TODO: Share the lines with the ones above?
    const overlappingEmptyCells = this.props.grid.emptyCells
    .map(cell => {
      return {
        cell: cell,
        overlappingPixels: this.getCellBundary(cell).overlappingPixels(cardRectangle)
      }
    })
    .filter(cellAndOverlap => cellAndOverlap.overlappingPixels > 0)
    .sort((cellAndOverlap1, cellAndOverlap2) => cellAndOverlap2.overlappingPixels - cellAndOverlap1.overlappingPixels)

    this.props.grid.emptyCells.forEach(cell => {
      if (overlappingEmptyCells.length === 0) {
        cell.hoveredByCard = undefined
      }
      else {
        cell === overlappingEmptyCells[0].cell
          ? cell.hoveredByCard = card
          : cell.hoveredByCard = undefined
      }
    })
  }

  private handleDragStarted(card: Card) {
    this.setState({
      draggedCard: card
    })
  }
}