import { computed } from 'mobx'
import { observable } from 'mobx'

import { Size } from './Size'

export class Settings {
  private constructor() { }

  @observable public availableWidth = 0
  public readonly maxCardValue = 13
  public readonly rows = 4
  public readonly numberOfShuffles = 100

  public readonly columns = this.maxCardValue + 1
  public readonly numberOfCards = this.maxCardValue * this.rows

  private static _instance: Settings
  private readonly cardSizeRatio = 3 / 2
  private readonly cardWidthToGutterRatio = 7 / 1

  /** It's necessary to use the singleton pattern, because @computed doesn't work on static fields. See https://github.com/mobxjs/mobx/issues/351#issuecomment-228304310. */
  public static get instance(): Settings {
    if (this._instance === undefined) {
      this._instance = new Settings()
    }

    return this._instance
  }

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