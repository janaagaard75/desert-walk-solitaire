import { computed } from 'mobx'
import { observable } from 'mobx'

import { Size } from './Size'

export class Settings {
  constructor(
    availableWidth: number
  ) {
    this.availableWidth = availableWidth
  }

  @observable public availableWidth: number
  public readonly maxCardValue = 13
  public readonly rows = 4

  public readonly columns = this.maxCardValue + 1

  private readonly cardSizeRatio = 3 / 2
  private readonly cardWidthToGutterRatio = 7 / 1

  @computed
  public get borderRadius(): number {
    return Math.round(this.cardSize.width / 8)
  }

  @computed
  public get borderWidth(): number {
    return Math.round(this.cardSize.width / 14)
  }

  @computed
  public get cardSize(): Size {
    const cardWidth = Math.floor(
      (
        this.availableWidth * this.cardWidthToGutterRatio
      ) / (
        this.columns * (this.cardWidthToGutterRatio + 1) + 1
      )
    )

    const cardHeight = Math.floor(this.cardSizeRatio * cardWidth)

    // TODO: Should verify that there is enough available height.

    return {
      height: cardHeight,
      width: cardWidth
    }
  }

  @computed
  public get gutterWidth(): number {
    const gutterWidth = Math.floor(
      (
        this.availableWidth - this.columns * this.cardSize.width
      ) / this.columns
    )

    return gutterWidth
  }
}