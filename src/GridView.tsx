import * as React from 'react'
import { Component } from 'react'
import { observer } from 'mobx-react'
import { View } from 'react-native'
import { ViewStyle } from 'react-native'

import { Card } from './Card'
import { Cell } from './Cell'
import { DraggableCardView } from './DraggableCardView'
import { EmptyCellView } from './EmptyCellView'
import { Game } from './Game'
import { Rectangle } from './Rectangle'
import { Settings } from './Settings'

@observer
export class GridView extends Component {
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
        {Game.instance.currentGridState.cardCellPairs.map(pair =>
          <DraggableCardView
            card={pair.card}
            correctlyPlaced={pair.correctlyPlaced}
            draggable={Game.instance.currentGridState.draggableCards.some(card => card === pair.card)}
            key={pair.card.key}
            onCardDragged={cardRectangle => this.handleCardDragged(cardRectangle)}
            onCardDropped={() => this.handleCardDropped(pair.cell)}
            onDragStarted={() => this.handleDragStarted(pair.card, pair.boundary)}
            startPosition={pair.position}
          />,
        )}
        {Game.instance.currentGridState.emptyCells.map(emptyCell =>
          <EmptyCellView
            key={emptyCell.cell.key}
            emptyCell={emptyCell}
            status={emptyCell.getStatus(Game.instance.draggedCard)}
          />,
        )}
      </View>
    )
  }

  // TODO: Move the handle-methods to the Game class, since draggedCard has been moved over there.
  private handleCardDragged(boundary: Rectangle) {
    if (Game.instance.draggedCard === undefined) {
      // throw new Error('draggedCard must be defined when handling a drag.')
      // TODO: It shouldn't be possible that draggedCard is undefined here, but two extra draggedCard calls are being made after the card was dropped.
      return
    }

    // Shadowing the variable to satisfy the TypeScript compiler below.
    const draggedCard = Game.instance.draggedCard

    // TODO: Consider making this code something that flows naturally from updating draggedCardBoundary. That probably requires switching from a state variable to an observable. See https://blog.cloudboost.io/3-reasons-why-i-stopped-using-react-setstate-ab73fc67a42e.
    // TODO: Also consider the cell being dragged from.
    // TODO: Consider sharing some code with the method below.
    const overlappedEmptyCells = Game.instance.currentGridState.emptyCells
      .map(emptyCell => {
        return {
          cell: emptyCell,
          overlappingPixels: emptyCell.cell.boundary.overlappingPixels(boundary),
        }
      })
      .filter(cellAndOverlap => cellAndOverlap.overlappingPixels > 0)
      .sort((cellAndOverlap1, cellAndOverlap2) => cellAndOverlap2.overlappingPixels - cellAndOverlap1.overlappingPixels)

    Game.instance.currentGridState.emptyCells
      .forEach(emptyCell => {
        if (overlappedEmptyCells.length === 0) {
          emptyCell.cell.hoveredByCard = undefined
        }
        else {
          const mostOverlappedCell = overlappedEmptyCells[0].cell
          emptyCell === mostOverlappedCell
            ? emptyCell.cell.hoveredByCard = draggedCard
            : emptyCell.cell.hoveredByCard = undefined
        }
      })

    Game.instance.draggedCardBoundary = boundary
  }

  private handleCardDropped(from: Cell) {
    if (Game.instance.draggedCard === undefined) {
      throw new Error('draggedCard must be defined when handling a drop.')
    }

    if (Game.instance.draggedCardBoundary === undefined) {
      throw new Error('draggedCardBoundary must be defined when handling a drop.')
    }

    // Shadowing the variable to satisfy the TypeScript compiler below.
    const draggedCard = Game.instance.draggedCard
    const draggedCardBoundary = Game.instance.draggedCardBoundary

    const overlappedTargetableEmptyCells = Game.instance.currentGridState.emptyCells
      .filter(emptyCell => emptyCell.cardIsDroppable(draggedCard))
      .map(emptyCell => {
        return {
          cell: emptyCell.cell,
          overlappingPixels: emptyCell.cell.boundary.overlappingPixels(draggedCardBoundary),
        }
      })
      .filter(cellAndOverlap => cellAndOverlap.overlappingPixels > 0)
      .sort((cellAndOverlap1, cellAndOverlap2) => cellAndOverlap2.overlappingPixels - cellAndOverlap1.overlappingPixels)

    if (overlappedTargetableEmptyCells.length > 0) {
      const mostOverlappedCell = overlappedTargetableEmptyCells[0].cell
      Game.instance.moveCard(from, mostOverlappedCell)
    }

    Game.instance.draggedCard = undefined
  }

  private handleDragStarted(card: Card, boundary: Rectangle) {
    Game.instance.draggedCard = card
    Game.instance.draggedCardBoundary = boundary
  }
}