import * as React from 'react'
import { Component } from 'react'
import { observer } from 'mobx-react'

import { Cell } from './Cell'
import { DraggableCard } from './DraggableCard'
import { EmptyCell } from './EmptyCell'
import { Position } from './Position'
import { Size } from './Size'

interface Props {
  cell: Cell
  onCardDropped: (cell: Cell, center: Position) => void
  position: Position
  size: Size
}

@observer
export class CellView extends Component<Props, {}> {
  public render() {
    return (
      // Using === undefined instead of isEmpty to avoid compiler error.
      this.props.cell.card === undefined ? (
        <EmptyCell
          isHovered={false}
          key={this.props.cell.key}
          position={this.props.position}
          size={this.props.size}
        />
      ) : (
        <DraggableCard
          card={this.props.cell.card}
          isDraggable={this.props.cell.cardIsDraggable}
          key={this.props.cell.key}
          onCardDropped={center => this.props.handleCardDropped(this.props.cell, center)}
          startPosition={this.props.position}
          size={this.props.size}
        />
      )
    )
  }
}