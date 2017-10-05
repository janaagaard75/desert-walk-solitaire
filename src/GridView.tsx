import * as React from 'react'
import { Component } from 'react'
import { observer } from 'mobx-react'
import { View } from 'react-native'
import { ViewStyle } from 'react-native'

import { BoundaryCardPair } from './BoundaryCardPair'
import { Card } from './Card'
import { Cell } from './Cell'
import { DraggableCardView } from './DraggableCardView'
import { EmptyCellView } from './EmptyCellView'
import { GridState } from './GridState'
import { Rectangle } from './Rectangle'
import { Settings } from './Settings'

interface Props {
  currentGridState: GridState
  onMoveCard: (from: Cell, to: Cell) => void
  previousGridState: GridState
}

interface State {
  // TODO: Consider making this private member that is an observable instead. EmptyCell.status should be a computed value.
  draggedCard: BoundaryCardPair | undefined
}

@observer
export class GridView extends Component<Props, State> {
  constructor(props: Props, context?: any) {
    super(props, context)

    this.state = {
      draggedCard: undefined,
    }
  }

  public render() {
    const gridViewStyle: ViewStyle = {
      height: Settings.instance.gridSize.height,
      position: 'relative',
      width: Settings.instance.gridSize.width,
    }

    return (
      <View
        style={gridViewStyle}
      >
        {this.props.currentGridState.cardCellPairs.map(pair =>
          <DraggableCardView
            card={pair.card}
            correctlyPlaced={pair.correctlyPlaced}
            draggable={this.props.currentGridState.draggableCards.some(card => card === pair.card)}
            key={pair.card.key}
            onCardDragged={cardRectangle => this.handleCardDragged(pair.card, cardRectangle)}
            onCardDropped={() => this.handleCardDropped(pair.cell)}
            onDragStarted={() => this.handleDragStarted(pair.card, pair.boundary)}
            startPosition={pair.position}
          />,
        )}
        {this.props.currentGridState.emptyCells.map(emptyCell =>
          <EmptyCellView
            key={emptyCell.cell.key}
            emptyCell={emptyCell}
            status={emptyCell.getStatus(this.state.draggedCard === undefined ? undefined : this.state.draggedCard.card)}
          />,
        )}
      </View>
    )
  }

  private handleCardDragged(card: Card, cardBoundary: Rectangle) {
    // TODO: Consider making this code something that flows naturally from updating draggedCardBoundary. That probably requires switching from a state variable to an observable. See https://blog.cloudboost.io/3-reasons-why-i-stopped-using-react-setstate-ab73fc67a42e.
    // TODO: Also consider the cell being dragged from.
    // TODO: Consider sharing some code with the method below.
    const overlappedEmptyCells = this.props.currentGridState.emptyCells
      .map(emptyCell => {
        return {
          cell: emptyCell,
          overlappingPixels: emptyCell.cell.boundary.overlappingPixels(cardBoundary),
        }
      })
      .filter(cellAndOverlap => cellAndOverlap.overlappingPixels > 0)
      .sort((cellAndOverlap1, cellAndOverlap2) => cellAndOverlap2.overlappingPixels - cellAndOverlap1.overlappingPixels)

    this.props.currentGridState.emptyCells
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
      draggedCard: {
        boundary: cardBoundary,
        card: card,
      },
    })
  }

  private handleCardDropped(from: Cell) {
    if (this.state.draggedCard === undefined) {
      throw new Error('draggedCard should be defined when handling a drop.')
    }

    // Shadowing draggedCardBoundary to satify the TypeScript compiler below.
    const draggedCardBoundary = this.state.draggedCard

    const overlappedTargetableEmptyCells = this.props.currentGridState.emptyCells
      .filter(emptyCell => emptyCell.cardIsDroppable(draggedCardBoundary.card))
      .map(emptyCell => {
        return {
          cell: emptyCell.cell,
          overlappingPixels: emptyCell.cell.boundary.overlappingPixels(draggedCardBoundary.boundary),
        }
      })
      .filter(cellAndOverlap => cellAndOverlap.overlappingPixels > 0)
      .sort((cellAndOverlap1, cellAndOverlap2) => cellAndOverlap2.overlappingPixels - cellAndOverlap1.overlappingPixels)

    if (overlappedTargetableEmptyCells.length > 0) {
      const mostOverlappedCell = overlappedTargetableEmptyCells[0].cell
      this.props.onMoveCard(from, mostOverlappedCell)
    }

    this.setState({
      draggedCard: undefined,
    })
  }

  private handleDragStarted(card: Card, boundary: Rectangle) {
    this.setState({
      draggedCard: {
        boundary: boundary,
        card: card,
      },
    })
  }
}