import * as React from 'react'
import { Component } from 'react'
import { observer } from 'mobx-react'
import { View } from 'react-native'
import { ViewStyle } from 'react-native'

import { Card } from './Card'
import { Cell } from './Cell'
import { DraggableCardView } from './DraggableCardView'
import { DraggedCardBoundary } from './DraggedCardBoundary'
import { EmptyCell } from './EmptyCell'
import { EmptyCellStatus } from './EmptyCellStatus'
import { EmptyCellView } from './EmptyCellView'
import { GridState } from './GridState'
import { Rectangle } from './Rectangle'
import { Settings } from './Settings'

interface Props {
  gridState: GridState
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
        {this.props.gridState.cardCellPairs.map(pair =>
          <DraggableCardView
            cardCellPair={pair}
            draggable={this.props.gridState.draggableCards.some(card => card === pair.card)}
            key={pair.card.key}
            onCardDragged={cardRectangle => this.handleCardDragged(pair.card, cardRectangle)}
            onCardDropped={() => this.handleCardDropped(pair.cell)}
            onDragStarted={() => this.handleDragStarted(pair.card, pair.boundary)}
          />
        )}
        {this.props.gridState.emptyCells.map(emptyCell =>
          <EmptyCellView
            key={emptyCell.cell.key}
            emptyCell={emptyCell}
            status={this.getEmptyCellStatus(emptyCell)}
          />
        )}
      </View>
    )
  }

  // TODO: Move this to the EmptyCell or the GridState class.
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
    // TODO: Consider making this code something that flows naturally from updating draggedCardBoundary. That probably requires switching from a state variable to an observable. See https://blog.cloudboost.io/3-reasons-why-i-stopped-using-react-setstate-ab73fc67a42e.
    // TODO: Also consider the cell being dragged from.
    // TODO: Consider sharing some code with the method below.
    const overlappedEmptyCells = this.props.gridState.emptyCells
      .map(emptyCell => {
        return {
          cell: emptyCell,
          overlappingPixels: emptyCell.cell.boundary.overlappingPixels(cardBoundary)
        }
      })
      .filter(cellAndOverlap => cellAndOverlap.overlappingPixels > 0)
      .sort((cellAndOverlap1, cellAndOverlap2) => cellAndOverlap2.overlappingPixels - cellAndOverlap1.overlappingPixels)

    this.props.gridState.emptyCells
      .forEach(emptyCell => {
        if (overlappedEmptyCells.length === 0) {
          emptyCell.cell.hoveredByCard = undefined
        }
        else {
          const mostOverlappedCell = overlappedEmptyCells[0].cell
          emptyCell === mostOverlappedCell
            ? emptyCell.cell.hoveredByCard = card
            : emptyCell.cell.hoveredByCard = undefined
        }
      })

    this.setState({
      draggedCardBoundary: {
        boundary: cardBoundary,
        card: card
      }
    })
  }

  private handleCardDropped(from: Cell) {
    if (this.state.draggedCardBoundary === undefined) {
      throw new Error('draggedCard should be defined when handling a drop.')
    }

    // Shadowing draggedCardBoundary to satify the TypeScript compiler below.
    const draggedCardBoundary = this.state.draggedCardBoundary

    const overlappedTargetableEmptyCells = this.props.gridState.emptyCells
      .filter(emptyCell => emptyCell.cardIsDroppable(draggedCardBoundary.card))
      .map(emptyCell => {
        return {
          cell: emptyCell.cell,
          overlappingPixels: emptyCell.cell.boundary.overlappingPixels(draggedCardBoundary.boundary)
        }
      })
      .filter(cellAndOverlap => cellAndOverlap.overlappingPixels > 0)
      .sort((cellAndOverlap1, cellAndOverlap2) => cellAndOverlap2.overlappingPixels - cellAndOverlap1.overlappingPixels)

    if (overlappedTargetableEmptyCells.length > 0) {
      const mostOverlappedCell = overlappedTargetableEmptyCells[0].cell
      this.props.onMoveCard(from, mostOverlappedCell)
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