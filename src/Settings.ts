import { computed } from 'mobx'
import { observable } from 'mobx'

import { Size } from './Size'

export class Settings {
  constructor(
    availableSize: Size
  ) {
    this.availableSize = availableSize
  }

  @observable public availableSize: Size
  public readonly columns = 14
  public readonly rows = 4

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
        this.availableSize.width * this.cardWidthToGutterRatio
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
        this.availableSize.width - this.columns * this.cardSize.width
      ) / this.columns
    )

    return gutterWidth
  }
}