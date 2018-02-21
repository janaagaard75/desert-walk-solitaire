import { computed } from 'mobx'
import { observable } from 'mobx'

import { Size } from './Size'
import { ScreenOrientation } from './ScreenOrientation'

export class Settings {
  private constructor() { }

  public readonly maxCardValue = 13
  public readonly rows = 4
  public readonly numberOfShuffles = 100
  @observable public windowSize: Size = { height: 0, width: 0 }

  public readonly animation = {
    replay: {
      duration: 100
    },
    snap: {
      duration: 200,
      elasticity: 1
    },
    turn: {
      duration: 400,
      elasticity: 0.5
    }
  }

  public readonly colors = {
    card: {
      background: '#fff',
      border: '#000',
      clubs: '#000',
      diamonds: '#f00',
      hearts: '#f00',
      shadowColor: '#000',
      spades: '#000'
    },
    gridBackgroundColor: '#464',
    mainBackgroundColor: '#333'
  }

  // It's necessary to use the singleton pattern, because @computed doesn't work on static fields. See https://github.com/mobxjs/mobx/issues/351#issuecomment-228304310. It's also necessary to use an _instance private member and a getter instead of simply making instance a public static field - don't know why, though.
  private static _instance: Settings

  public static get instance() {
    if (this._instance === undefined) {
      this._instance = new Settings()
    }

    return this._instance
  }

  public readonly columns = this.maxCardValue + 1
  public readonly numberOfCards = this.maxCardValue * this.rows
  public readonly cardShadowOpacity = 0.6

  private readonly cardSizeRatio = 3 / 2
  private readonly cardWidthToGutterRatio = 7 / 1

  @computed
  public get borderRadius(): number {
    return Math.round(this.cardSize.width / 8)
  }

  @computed
  public get borderWidth(): number {
    return Math.round(this.cardSize.width / 20)
  }

  @computed
  public get cardPadding(): number {
    return Math.floor(Settings.instance.cardSize.width / 20)
  }

  @computed
  public get cardShadowOffset() {
    const offset = {
      height: Math.round(Settings.instance.cardSize.width / 20),
      width: Math.round(Settings.instance.cardSize.width / 50)
    }
    return offset
  }

  @computed
  public get cardShadowRadius() {
    return Math.round(Settings.instance.cardSize.width / 10)
  }

  @computed
  public get cardSize(): Size {
    if (this.restrictedBy === 'height') {
      return this.heightRestrictedCardSize
    }
    else {
      return this.widthRestrictedCardSize
    }
  }

  @computed
  public get cardSuitSize(): number {
    return Math.round(Settings.instance.cardSize.width / 40 * 18)
  }

  @computed
  public get cardSuitLeft(): number {
    return Math.round(Settings.instance.cardSize.width / 40)
  }

  @computed
  public get cardSuitTop(): number {
    return Math.round(Settings.instance.cardSize.width / 2)
  }

  @computed
  public get cardValueFontSize(): number {
    return Math.round(Settings.instance.cardSize.width / 2)
  }

  @computed
  public get cardValueLeft(): number {
    return -Math.round(Settings.instance.cardSize.width / 40 * 16)
  }

  @computed
  public get cardValueLetterSpacing(): number {
    return -Math.round(Settings.instance.cardSize.width / 15)
  }

  @computed
  public get cardValueTop(): number {
    return -Math.round(Settings.instance.cardSize.width / 40 * 3)
  }

  @computed
  public get cardValueWidth(): number {
    return Math.round(1.22 * Settings.instance.cardSize.width)
  }

  @computed
  public get gridSize(): Size {
    const width = this.cardSize.width * this.columns + this.gutterSize * (this.columns - 1)
    const height = this.cardSize.height * this.rows + this.gutterSize * (this.rows - 1)

    return {
      height: height,
      width: width
    }
  }

  @computed
  public get gutterSize(): number {
    if (this.restrictedBy === 'height') {
      return this.heightRestrictedGutterSize
    }
    else {
      return this.widthRestrictedGutterSize
    }
  }

  @computed
  public get screenOrientation(): ScreenOrientation {
    if (this.windowSize.height > this.windowSize.width) {
      return ScreenOrientation.Portrait
    }
    else {
      return ScreenOrientation.Landscape
    }
  }

  @computed
  private get restrictedBy(): 'height' | 'width' {
    if (this.heightRestrictedPlayingFieldSize.width <= this.widthRestrictedPlayingFieldSize.width) {
      return 'height'
    }
    else {
      return 'width'
    }
  }

  @computed
  private get availablePlayingFieldSize(): Size {
    // TODO: Figure out the correct height of the menu bars.
    const menuBarsHeight = 50
    // TODO: Take account of the notch on the iPhone X.
    return {
      height: this.windowSize.height - menuBarsHeight,
      width: this.windowSize.width
    }
  }

  @computed
  private get heightRestrictedCardSize(): Size {
    // gutter * cardWithToGutterRatio = cardWidth
    // cardWidth * cardSizeRatio = cardHeight
    // rows * cardHeight + (rows + 1) * gutter <= availableHeight
    //
    // ah = availableHeight
    // cw = cardWidth
    // ch = cardHeight
    // g = gutter
    // gr = cardWidthToGutterRatio
    // sr = cardSizeRatio
    // r = rows
    //
    // g = cw / gr
    // ch = cw sr
    //
    // r ch + (r + 1) g <= ah
    // r cw sr + (r + 1) cw / gr <= ah
    // cw (r sr + (r + 1) / gr) <= ah
    // cw <= ah / (r sr + (r + 1) / gr)
    // cw <= ah gr / (r sr + (r + 1) / gr) gr
    // cw <= ah gr / (r sr gr + r + 1)
    // cw <= ah gr / (r (sr gr + 1) + 1)

    const cardWidth = Math.floor(
      (
        this.availablePlayingFieldSize.height * this.cardWidthToGutterRatio
      ) / (
        this.rows * (this.cardSizeRatio * this.cardWidthToGutterRatio + 1) + 1
      )
    )

    const cardHeight = Math.floor(cardWidth * this.cardSizeRatio)

    return {
      height: cardHeight,
      width: cardWidth
    }
  }

  @computed
  private get heightRestrictedGutterSize(): number {
    const gutterSize = Math.floor(
      (
        this.availablePlayingFieldSize.height - this.rows * this.heightRestrictedCardSize.height
      ) / this.rows
    )

    return gutterSize
  }

  @computed
  private get heightRestrictedPlayingFieldSize(): Size {
    const height = this.rows * this.heightRestrictedCardSize.height
      + (this.rows + 1) * this.heightRestrictedGutterSize
    const width = this.columns * this.heightRestrictedCardSize.width
      + (this.columns + 1) * this.heightRestrictedGutterSize

    return {
      height: height,
      width: width
    }
  }

  @computed
  private get widthRestrictedCardSize(): Size {
    // gutter * cardWithToGutterRatio = cardWidth
    // columns * cardWidth + (columns + 1) * gutter <= availableWidth
    //
    // aw = availableWidth
    // cw = cardWidth
    // g = gutter
    // gr = cardWidthToGutterRatio
    // c = columns
    //
    // g = cw / gr
    //
    // c cw + (c + 1) cw / gr <= aw
    // cw (c + (c + 1) / gr) <= aw
    // cw (c + c / gr + 1 / gr) <= aw
    // cw <= aw / (c + c / gr + 1 / gr)
    // cw <= aw gr / (c + c / gr + 1 / gr) gr
    // cw <= aw gr / (c gr + c + 1)
    // cw <= aw gr / (c (gr + 1) + 1)

    const cardWidth = Math.floor(
      (
        this.availablePlayingFieldSize.width * this.cardWidthToGutterRatio
      ) / (
        this.columns * (this.cardWidthToGutterRatio + 1) + 1
      )
    )

    const cardHeight = Math.floor(cardWidth * this.cardSizeRatio)

    return {
      height: cardHeight,
      width: cardWidth
    }
  }

  @computed
  private get widthRestrictedGutterSize(): number {
    const gutterSize = Math.floor(
      (
        this.availablePlayingFieldSize.width - this.columns * this.widthRestrictedCardSize.width
      ) / this.columns
    )

    return gutterSize
  }

  @computed
  private get widthRestrictedPlayingFieldSize(): Size {
    const height = this.rows * this.widthRestrictedCardSize.height
      + (this.rows + 1) * this.widthRestrictedGutterSize
    const width = this.columns * this.widthRestrictedCardSize.width
      + (this.columns + 1) * this.widthRestrictedGutterSize

    return {
      height: height,
      width: width
    }
  }
}