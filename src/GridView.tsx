import * as React from 'react'
import { Component } from 'react'
import { observer } from 'mobx-react'
import { View } from 'react-native'
import { ViewStyle } from 'react-native'

import { Card } from './Card'
import { Cell } from './Cell'
import { DraggableCard } from './DraggableCard'
import { DraggedCardBoundary } from './DraggedCardBoundary'
import { EmptyCell } from './EmptyCell'
import { EmptyCellStatus } from './EmptyCellStatus'
import { EmptyCellView } from './EmptyCellView'
import { Rectangle } from './Rectangle'
import { Settings } from './Settings'
import { TurnState } from './TurnState'

interface Props {
  turnState: TurnState
  onMoveCard: (from: Cell, to: Cell) => void
}

interface State {
  draggedCardBoundary: DraggedCardBoundary | undefined
}

@observer
export class GridView extends Component<Props, State> {
  constructor(props: Props, context?: any) {
    super(props, context)

    this.state = {
      draggedCardBoundary: undefined
    }
  }

  public render() {
    const gridViewStyle: ViewStyle = {
      height: Settings.instance.gridSize.height,
      position: 'relative',
      width: Settings.instance.gridSize.width
    }

    return (
      <View
        style={gridViewStyle}
      >
        {this.props.turnState.positionedCards.map(positionedCard =>
          <DraggableCard
            draggable={this.props.turnState.draggableCards.some(card => card === positionedCard.card)}
            key={positionedCard.card.key}
            onCardDragged={cardRectangle => this.handleCardDragged(positionedCard.card, cardRectangle)}
            onCardDropped={() => this.handleCardDropped(positionedCard.cell)}
            onDragStarted={() => this.handleDragStarted(positionedCard.card, positionedCard.boundary)}
            positionedCard={positionedCard}
          />
        )}
        {this.props.turnState.emptyCells.map(emptyCell =>
          <EmptyCellView
            key={emptyCell.key}
            emptyCell={emptyCell}
            status={this.getEmptyCellStatus(emptyCell)}
          />
        )}
      </View>
    )
  }

  // TODO: Move this to the EmptyCell or the TurnState class.
  private getEmptyCellStatus(emptyCell: EmptyCell): EmptyCellStatus {
    if (emptyCell.droppableCards.length === 0) {
      return EmptyCellStatus.Blocked
    }

    if (this.state.draggedCardBoundary === undefined) {
      return EmptyCellStatus.DropAllowedAndNoCardIsBeingDragged
    }

    if (emptyCell.hoveredByDroppableCard) {
      return EmptyCellStatus.HoveredByDropableCard
    }

    if (this.state.draggedCardBoundary !== undefined) {
      const draggedCard = this.state.draggedCardBoundary.card
      if (emptyCell.droppableCards.some(card => card === draggedCard)) {
        return EmptyCellStatus.CurrentlyDraggedCardDroppable
      }
    }

    return EmptyCellStatus.DropAllowedButNotCurrentlyDraggedCard
  }

  private handleCardDragged(card: Card, cardBoundary: Rectangle) {
    // TODO: Also consider the cell being dragged from.
    // TODO: Consider sharing some code with the method above.
    const overlappingEmptyCells = this.props.turnState.emptyCells
      .map(cell => {
        return {
          cell: cell,
          overlappingPixels: cell.boundary.overlappingPixels(cardBoundary)
        }
      })
      .filter(cellAndOverlap => cellAndOverlap.overlappingPixels > 0)
      .sort((cellAndOverlap1, cellAndOverlap2) => cellAndOverlap2.overlappingPixels - cellAndOverlap1.overlappingPixels)

    this.props.turnState.emptyCells
      .forEach(cell => {
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

  private handleCardDropped(from: Cell) {
    if (this.state.draggedCardBoundary === undefined) {
      throw new Error('draggedCard should be defined when handling a drop.')
    }

    // Shadowing draggedCardBoundary to satify the TypeScript compiler below.
    const draggedCardBoundary = this.state.draggedCardBoundary

    // TODO: Something's wrong with the boundaries, resulting in no overlapping pixels. Strange, since the highlighting works as it should when dragging a card in the code right above.
    const overlappingEmptyCells = this.props.turnState.emptyCells
      .filter(emptyCell => emptyCell.cardIsDroppable(draggedCardBoundary.card))
      .map(emptyCell => {
        return {
          cell: emptyCell,
          overlappingPixels: emptyCell.boundary.overlappingPixels(draggedCardBoundary.boundary)
        }
      })
      .filter(cellAndOverlap => cellAndOverlap.overlappingPixels > 0)
      .sort((cellAndOverlap1, cellAndOverlap2) => cellAndOverlap2.overlappingPixels - cellAndOverlap1.overlappingPixels)

    if (overlappingEmptyCells.length > 0) {
      const to = overlappingEmptyCells[0].cell
      this.props.onMoveCard(from, to)
    }

    this.setState({
      draggedCardBoundary: undefined
    })
  }

  private handleDragStarted(card: Card, boundary: Rectangle) {
    this.setState({
      draggedCardBoundary: {
        boundary: boundary,
        card: card
      }
    })
  }
}