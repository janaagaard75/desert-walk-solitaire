import * as React from 'react'
import { Component } from 'react'
import { observer } from 'mobx-react'

import { Card } from './Card'
import { Cell } from './Cell'
import { DraggableCard } from './DraggableCard'
import { EmptyCell } from './EmptyCell'
import { EmptyCellStatus } from './EmptyCellStatus'
import { Rectangle } from './Rectangle'

interface Props {
  draggable: boolean
  cell: Cell
  draggedCard: Card | undefined
  onCardDropped: (fromCell: Cell, cardRectangle: Rectangle) => void
  onCardMoved: (card: Card, cardRectangle: Rectangle) => void
  onDragStarted: (card: Card) => void
}

@observer
export class CellView extends Component<Props, {}> {
  public render() {
    if (this.props.cell.card === undefined) {
      return (
        <EmptyCell
          key={this.props.cell.key}
          position={this.props.cell.position}
          status={this.getEmptyCellStatus()}
        />
      )
    }
    else {
      // Necessary to satisfy the TypeScript compiler in the onCardMoved line below.
      const definedCard = this.props.cell.card

      return (
        // TODO: DraggableCard is not being re-rendered when the orientation changes. Fix this.
        <DraggableCard
          card={definedCard}
          draggable={this.props.draggable}
          correctlyPlaced={this.props.cell.cardIsCorrectlyPlaced}
          key={this.props.cell.key}
          onCardDropped={cardRectangle => this.props.onCardDropped(this.props.cell, cardRectangle)}
          onCardMoved={cardRectangle => this.props.onCardMoved(definedCard, cardRectangle)}
          onDragStarted={card => this.props.onDragStarted(card)}
        />
      )
    }
  }

  private getEmptyCellStatus(): EmptyCellStatus {
    if (this.props.cell.droppableCards.length === 0) {
      return EmptyCellStatus.Blocked
    }

    if (this.props.draggedCard === undefined) {
      return EmptyCellStatus.DropAllowedAndNoCardIsBeingDragged
    }

    if (this.props.cell.hoveredByDroppableCard) {
      return EmptyCellStatus.HoveredByDropableCard
    }

    if (this.props.cell.droppableCards.some(card => card === this.props.draggedCard)) {
      return EmptyCellStatus.CurrentlyDraggedCardDroppable
    }

    return EmptyCellStatus.DropAllowedButNotCurrentlyDraggedCard
  }
}