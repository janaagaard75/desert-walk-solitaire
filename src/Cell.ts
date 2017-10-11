import { computed } from 'mobx'

import { Card } from './Card'
import { Game } from './Game'
import { Point } from './Point'
import { Rectangle } from './Rectangle'
import { Settings } from './Settings'

interface OverlappingCard {
  card: Card,
  overlappingPixels: number,
}

export class Cell {
  constructor(
    public readonly rowIndex: number,
    public readonly columnIndex: number,
    public readonly cellToTheLeft: Cell | undefined,
  ) {
    this.key = this.rowIndex * Settings.instance.columns + this.columnIndex + 1
  }

  public readonly key: number

  @computed
  public get boundary(): Rectangle {
    const boundary = new Rectangle(
      this.position.x,
      this.position.x + Settings.instance.cardSize.width,
      this.position.y,
      this.position.y + Settings.instance.cardSize.height,
    )

    return boundary
  }

  // TODO: Add something that only returns the most hovered card.
  @computed
  public get hoveredByCard(): OverlappingCard | undefined {
    if (Game.instance.draggedCard === undefined || Game.instance.draggedCardBoundary === undefined) {
      return undefined
    }

    const overlappingPixels = this.boundary.overlappingPixels(Game.instance.draggedCardBoundary)
    if (overlappingPixels === 0) {
      return undefined
    }

    return {
      card: Game.instance.draggedCard,
      overlappingPixels: overlappingPixels,
    }
  }

  @computed
  public get position(): Point {
    const position = {
      x: this.columnIndex * (Settings.instance.cardSize.width + Settings.instance.gutterWidth),
      y: this.rowIndex * (Settings.instance.cardSize.height + Settings.instance.gutterWidth),
    }

    return position
  }
}