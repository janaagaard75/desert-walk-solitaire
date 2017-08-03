import * as React from 'react'
import { Component } from 'react'
import { observer } from 'mobx-react'

import { Card } from './Card'
import { Cell } from './Cell'
import { DraggableCard } from './DraggableCard'
import { EmptyCell } from './EmptyCell'
import { Position } from './Position'
import { Size } from './Size'

interface Props {
  isDraggable: boolean
  cell: Cell
  extraSpace: number
  onCardDropped: (fromCell: Cell, cardCenter: Position) => void
  onCardMoved: (card: Card, cardCenter: Position) => void
  position: Position
  size: Size
}

@observer
export class CellView extends Component<Props, {}> {
  public render() {
    const wrongPlacePosition: Position = {
      left: this.props.position.left + this.props.extraSpace,
      top: this.props.position.top
    }

    // Using === undefined instead of isEmpty to be able to create definedCard below.
    if (this.props.cell.card === undefined) {
      return (
        <EmptyCell
          hoveredByCard={this.props.cell.hoveredByCard}
          key={this.props.cell.key}
          position={wrongPlacePosition}
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
          startPosition={this.props.cell.cardIsInRightPlace ? this.props.position : wrongPlacePosition}
          size={this.props.size}
        />
      )
    }
  }
}