import * as React from 'react'
import { Component } from 'react'
import { observer } from 'mobx-react'

import { Cell } from './Cell'
import { DraggableCard } from './DraggableCard'
import { EmptyCell } from './EmptyCell'
import { Position } from './Position'

interface Props {
  cell: Cell
  handleCardDropped: (cell: Cell, center: Position) => any
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
          position={this.props.cell.position}
          size={this.props.cell.size}
        />
      ) : (
        <DraggableCard
          card={this.props.cell.card}
          isDraggable={this.props.cell.cardIsDraggable}
          key={this.props.cell.key}
          onCardDropped={center => this.props.handleCardDropped(this.props.cell, center)}
          startPosition={this.props.cell.position}
          size={this.props.cell.size}
        />
      )
    )
  }
}