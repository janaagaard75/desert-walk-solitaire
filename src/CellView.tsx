import * as React from 'react'
import { Component } from 'react'
import { observer } from 'mobx-react'

import { Card } from './Card'
import { Cell } from './Cell'
import { DraggableCard } from './DraggableCard'
import { EmptyCell } from './EmptyCell'
import { Point } from './Position'
import { Size } from './Size'

interface Props {
  isDraggable: boolean
  cell: Cell
  draggedCard: Card | undefined
  onCardDropped: (fromCell: Cell, cardCenter: Point) => void
  onCardMoved: (card: Card, cardCenter: Point) => void
  onDragStarted: (card: Card) => void
  position: Point
  size: Size
}

@observer
export class CellView extends Component<Props, {}> {
  public render() {
    if (this.props.cell.card === undefined) {
      return (
        <EmptyCell
          blocked={this.isBlocked()}
          hoveredByCardDropableCard={this.props.cell.hoveredByDroppableCard}
          key={this.props.cell.key}
          position={this.props.position}
          size={this.props.size}
        />
      )
    }
    else {
      // Necessary to satisfy the TypeScript compiler in the onCardMoved line below.
      const definedCard = this.props.cell.card

      return (
        <DraggableCard
          card={definedCard}
          isDraggable={this.props.isDraggable}
          isInCorrectPlace={this.props.cell.cardIsInRightPlace}
          key={this.props.cell.key}
          onCardDropped={cardCenter => this.props.onCardDropped(this.props.cell, cardCenter)}
          onCardMoved={cardCenter => this.props.onCardMoved(definedCard, cardCenter)}
          onDragStarted={card => this.props.onDragStarted(card)}
          startPosition={this.props.position}
          size={this.props.size}
        />
      )
    }
  }

  private isBlocked(): boolean {
    if (this.props.cell.droppableCards.length === 0) {
      return true
    }

    if (this.props.draggedCard !== undefined && !this.props.cell.droppableCards.some(card => card === this.props.draggedCard)) {
      return true
    }

    return false
  }
}