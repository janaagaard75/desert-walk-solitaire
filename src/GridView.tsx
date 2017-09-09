import * as React from 'react'
import { Component } from 'react'
import { observer } from 'mobx-react'
import { View } from 'react-native'
import { ViewStyle } from 'react-native'

import { Card } from './Card'
import { Cell } from './Cell'
import { CellView } from './CellView'
import { Game } from './Game'
import { Rectangle } from './Rectangle'

interface Props {
  grid: Game
}

interface State {
  draggedCard: Card | undefined
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
      flex: 1,
      position: 'relative'
    }

    return (
      <View
        style={gridViewStyle}
      >
        {this.props.grid.cells.map(cell =>
          <CellView
            cell={cell}
            draggedCard={this.state.draggedCard}
            isDraggable={this.props.grid.draggableCards.some(card => cell.card === card)}
            key={cell.key}
            onCardDropped={(fromCell, cardRectangle) => this.handleCardDropped(fromCell, cardRectangle)}
            onCardMoved={(card, cardRectangle) => this.handleCardMoved(card, cardRectangle)}
            onDragStarted={card => this.handleDragStarted(card)}
          />
        )}
      </View>
    )
  }

  private handleCardDropped(from: Cell, cardBoundary: Rectangle) {
    if (this.state.draggedCard === undefined) {
      throw new Error('draggedCard should be defined when handling a drop.')
    }

    const overlappingEmptyCells = this.props.grid.emptyCells
      .filter(cell => this.props.grid.cardIsDroppable(this.state.draggedCard as Card, cell))
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
      this.props.grid.moveCard(from, to)
    }

    this.setState({
      draggedCard: undefined
    })
  }

  private handleCardMoved(card: Card, cardBoundary: Rectangle) {
    // TODO: Also consider the cell being dragged from.
    // TODO: Consider sharing some code with the method above.
    const overlappingEmptyCells = this.props.grid.emptyCells
      .map(cell => {
        return {
          cell: cell,
          overlappingPixels: cell.boundary.overlappingPixels(cardBoundary)
        }
      })
      .filter(cellAndOverlap => cellAndOverlap.overlappingPixels > 0)
      .sort((cellAndOverlap1, cellAndOverlap2) => cellAndOverlap2.overlappingPixels - cellAndOverlap1.overlappingPixels)

    this.props.grid.emptyCells.forEach(cell => {
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

  private handleDragStarted(card: Card) {
    this.setState({
      draggedCard: card
    })
  }
}