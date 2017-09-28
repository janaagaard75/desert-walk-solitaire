import * as React from 'react'
import { Component } from 'react'
import { observer } from 'mobx-react'
import { View } from 'react-native'
import { ViewStyle } from 'react-native'

import { Card } from './Card'
import { Cell } from './Cell'
import { DraggableCard } from './DraggableCard'
import { DraggedCard } from './DraggedCard'
import { EmptyCellStatus } from './EmptyCellStatus'
import { EmptyCellView } from './EmptyCellView'
import { Point } from './Point'
import { Rectangle } from './Rectangle'
import { Settings } from './Settings'
import { TurnState } from './TurnState'

interface Props {
  turnState: TurnState
  onMoveCard: (from: Cell, to: Cell) => void
}

interface State {
  draggedCard: DraggedCard | undefined
}

@observer
export class GridView extends Component<Props, State> {
  constructor(props: Props, context?: any) {
    super(props, context)

    this.state = {
      draggedCard: undefined
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
            onCardDropped={cardRectangle => this.handleCardDropped(positionedCard.cell, cardRectangle)}
            onDragStarted={() => this.handleDragStarted(positionedCard.card, positionedCard.position)}
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

  // TODO: Move this to the EmptyCell class or, possibly, to the TurnState class.
  private getEmptyCellStatus(cell: Cell): EmptyCellStatus {
    // TODO: Implement missing statuses.

    // if (cell.droppableCards.length === 0) {
    //   return EmptyCellStatus.Blocked
    // }

    if (this.state.draggedCard === undefined) {
      return EmptyCellStatus.DropAllowedAndNoCardIsBeingDragged
    }

    // if (cell.hoveredByDroppableCard) {
    //   return EmptyCellStatus.HoveredByDropableCard
    // }

    // if (cell.droppableCards.some(card => card === this.props.draggedCard)) {
    //   return EmptyCellStatus.CurrentlyDraggedCardDroppable
    // }

    return EmptyCellStatus.DropAllowedButNotCurrentlyDraggedCard
  }

  private handleCardDropped(from: Cell, cardBoundary: Rectangle) {
    if (this.state.draggedCard === undefined) {
      throw new Error('draggedCard should be defined when handling a drop.')
    }

    const draggedCard = this.state.draggedCard.card

    const overlappingEmptyCells = this.props.turnState.emptyCells
      .filter(emptyCell => emptyCell.cardIsDroppable(draggedCard))
      .map(cell => {
        return {
          cell: cell,
          overlappingPixels: cell.boundary.overlappingPixels(cardBoundary)
        }
      })
      .filter(cellAndOverlap => cellAndOverlap.overlappingPixels > 0)
      .sort((cellAndOverlap1, cellAndOverlap2) => cellAndOverlap2.overlappingPixels - cellAndOverlap1.overlappingPixels)

    if (overlappingEmptyCells.length > 0) {
      const to = overlappingEmptyCells[0].cell
      this.props.onMoveCard(from, to)
    }

    this.setState({
      draggedCard: undefined
    })
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

  private handleDragStarted(card: Card, position: Point) {
    this.setState({
      draggedCard: {
        card: card,
        position: position
      }
    })
  }
}