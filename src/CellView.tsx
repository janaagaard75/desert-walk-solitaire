import * as React from 'react'
import { Component } from 'react'
import { observer } from 'mobx-react'

import { Card } from './Card'
import { Cell } from './Cell'
import { DraggableCard } from './DraggableCard'
import { EmptyCell } from './EmptyCell'
import { EmptyCellStatus } from './EmptyCellStatus'
import { Point } from './Point'
import { Rectangle } from './Rectangle'
import { Settings } from './Settings'

interface Props {
  isDraggable: boolean
  cell: Cell
  draggedCard: Card | undefined
  onCardDropped: (fromCell: Cell, cardRectangle: Rectangle) => void
  onCardMoved: (card: Card, cardRectangle: Rectangle) => void
  onDragStarted: (card: Card) => void
  position: Point
  settings: Settings
}

@observer
export class CellView extends Component<Props, {}> {
  public render() {
    if (this.props.cell.card === undefined) {
      return (
        <EmptyCell
          key={this.props.cell.key}
          position={this.props.position}
          settings={this.props.settings}
          status={this.getEmptyCellStatus()}
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
          onCardDropped={cardRectangle => this.props.onCardDropped(this.props.cell, cardRectangle)}
          onCardMoved={cardRectangle => this.props.onCardMoved(definedCard, cardRectangle)}
          onDragStarted={card => this.props.onDragStarted(card)}
          settings={this.props.settings}
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