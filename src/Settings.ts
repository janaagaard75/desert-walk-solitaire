import { computed } from 'mobx'
import { observable } from 'mobx'

import { Size } from './Size'

export class Settings {
  private constructor() { }

  @observable public availableWidth = 0
  public readonly maxCardValue = 13
  public readonly rows = 4
  public readonly numberOfShuffles = 100

  public readonly colors = {
    card: {
      border: {
        correctlyPlaced: '#0a0',
        incorrectlyPlaced: '#444'
      },
      draggable: {
        backgroundColor: '#fff',
        clubs: '#000',
        diamonds: '#f00',
        hearts: '#f00',
        spades: '#000'
      },
      draggedShadowColor: '#000',
      fixed: {
        backgroundColor: '#ccc',
        clubs: '#666',
        diamonds: '#f66',
        hearts: '#f66',
        spades: '#666'
      }
    },
    gridBackgroundColor: '#259',
    mainBackgroundColor: '#bbb' // Currently not used.
  }

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
  public get cardPadding(): number {
    return Math.floor(Settings.instance.cardSize.width / 20)
  }

  @computed
  public get cardShadowOffset() {
    const offset = {
      height: Math.floor(Settings.instance.cardSize.width / 20),
      width: Math.floor(Settings.instance.cardSize.width / 50)
    }
    return offset
  }

  @computed
  public get cardShadowRadius() {
    return Math.floor(Settings.instance.cardSize.width / 15)
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
  public get cardSuitBottom(): number {
    return -Math.floor(Settings.instance.cardSize.width / 8)
  }

  @computed
  public get cardSuitFontSize(): number {
    return Math.floor(Settings.instance.cardSize.width)
  }

  @computed
  public get cardSuitRight(): number {
    return -Math.floor(0.12 * Settings.instance.cardSize.width)
  }

  @computed
  public get cardValueFontSize(): number {
    return Math.floor(0.95 * Settings.instance.cardSize.width)
  }

  @computed
  public get cardValueLeft(): number {
    return -Math.floor(Settings.instance.cardSize.width / 8)
  }

  @computed
  public get cardValueLetterSpacing(): number {
    return -Math.floor(Settings.instance.cardSize.width / 15)
  }

  @computed
  public get cardValueTop(): number {
    return -Math.floor(0.17 * Settings.instance.cardSize.width)
  }

  @computed
  public get cardValueWidth(): number {
    return Math.floor(1.22 * Settings.instance.cardSize.width)
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