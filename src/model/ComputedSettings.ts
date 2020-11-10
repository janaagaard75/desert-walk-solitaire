import { computed, makeObservable, observable } from "mobx"
import { Dimensions, Platform } from "react-native"
import { PointInterface } from "./PointInterface"
import { Rectangle } from "./Rectangle"
import { Settings } from "./Settings"
import { Size } from "./Size"

export class ComputedSettings {
  // It's necessary to use the singleton pattern, because @computed doesn't work on static fields. See https://github.com/mobxjs/mobx/issues/351#issuecomment-228304310. It's also necessary to use an _instance private member and a getter instead of simply making instance a public static field - don't know why, though.
  private static _instance: ComputedSettings

  constructor() {
    makeObservable<
      ComputedSettings,
      | "restrictedBy"
      | "availablePlayingFieldSize"
      | "heightRestrictedCardSize"
      | "heightRestrictedGutterSize"
      | "heightRestrictedPlayingFieldSize"
      | "widthRestrictedCardSize"
      | "widthRestrictedGutterSize"
      | "widthRestrictedPlayingFieldSize"
    >(this)
  }

  public static get instance() {
    if (this._instance === undefined) {
      this._instance = new ComputedSettings()
    }

    return this._instance
  }

  private readonly cardSizeRatio = 3 / 2
  private readonly cardWidthToGutterRatio = 7 / 1
  // Manually tweaked value.
  private readonly footerHeight = 66

  @observable public windowSize: Size = { height: 0, width: 0 }

  public static isIosWithoutHomeButton() {
    // Code based on https://github.com/ptelad/react-native-iphone-x-helper.
    const windowSize = Dimensions.get("window")

    const isIphone =
      Platform.OS === "ios" && !Platform.isPad && !Platform.isTVOS
    const iphonesWithoutHomeButtonHeights = [812, 896]
    const isNotchedIphone =
      isIphone &&
      (iphonesWithoutHomeButtonHeights.includes(windowSize.height) ||
        iphonesWithoutHomeButtonHeights.includes(windowSize.width))

    const ipadsWithoutHomeButtonHeights = [1194, 1366]
    const isIpad = Platform.OS === "ios" && Platform.isPad && !Platform.isTVOS
    const isNotchedIpad =
      isIpad &&
      (ipadsWithoutHomeButtonHeights.includes(windowSize.height) ||
        ipadsWithoutHomeButtonHeights.includes(windowSize.width))

    return isNotchedIphone || isNotchedIpad
  }

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
    return Math.floor(this.cardSize.width / 20)
  }

  @computed
  public get cardShadowOffset() {
    const offset = {
      height: Math.round(this.cardSize.width / 20),
      width: Math.round(this.cardSize.width / 50),
    }
    return offset
  }

  @computed
  public get cardShadowRadius() {
    return Math.round(this.cardSize.width / 10)
  }

  @computed
  public get cardSize(): Size {
    if (this.restrictedBy === "height") {
      return this.heightRestrictedCardSize
    } else {
      return this.widthRestrictedCardSize
    }
  }

  @computed
  public get gridSize(): Size {
    const width =
      this.cardSize.width * Settings.columns +
      this.gutterSize * (Settings.columns - 1)
    const height =
      this.cardSize.height * Settings.rows +
      this.gutterSize * (Settings.rows - 1)

    return {
      height: height,
      width: width,
    }
  }

  @computed
  public get gutterSize(): number {
    if (this.restrictedBy === "height") {
      return this.heightRestrictedGutterSize
    } else {
      return this.widthRestrictedGutterSize
    }
  }

  @computed
  private get restrictedBy(): "height" | "width" {
    if (
      this.heightRestrictedPlayingFieldSize.width <=
      this.widthRestrictedPlayingFieldSize.width
    ) {
      return "height"
    } else {
      return "width"
    }
  }

  @computed
  private get availablePlayingFieldSize(): Size {
    let availableWidth = this.windowSize.width
    if (ComputedSettings.isIosWithoutHomeButton()) {
      const notchHeight = 40
      availableWidth -= 2 * notchHeight
    }

    return {
      height: this.windowSize.height - this.footerHeight,
      width: availableWidth,
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
      (this.availablePlayingFieldSize.height * this.cardWidthToGutterRatio) /
        (Settings.rows *
          (this.cardSizeRatio * this.cardWidthToGutterRatio + 1) +
          1)
    )

    const cardHeight = Math.floor(cardWidth * this.cardSizeRatio)

    return {
      height: cardHeight,
      width: cardWidth,
    }
  }

  @computed
  private get heightRestrictedGutterSize(): number {
    const gutterSize = Math.floor(
      (this.availablePlayingFieldSize.height -
        Settings.rows * this.heightRestrictedCardSize.height) /
        Settings.rows
    )

    return gutterSize
  }

  @computed
  private get heightRestrictedPlayingFieldSize(): Size {
    const height =
      Settings.rows * this.heightRestrictedCardSize.height +
      (Settings.rows + 1) * this.heightRestrictedGutterSize
    const width =
      Settings.columns * this.heightRestrictedCardSize.width +
      (Settings.columns + 1) * this.heightRestrictedGutterSize

    return {
      height: height,
      width: width,
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
      (this.availablePlayingFieldSize.width * this.cardWidthToGutterRatio) /
        (Settings.columns * (this.cardWidthToGutterRatio + 1) + 1)
    )

    const cardHeight = Math.floor(cardWidth * this.cardSizeRatio)

    return {
      height: cardHeight,
      width: cardWidth,
    }
  }

  @computed
  private get widthRestrictedGutterSize(): number {
    const gutterSize = Math.floor(
      (this.availablePlayingFieldSize.width -
        Settings.columns * this.widthRestrictedCardSize.width) /
        Settings.columns
    )

    return gutterSize
  }

  @computed
  private get widthRestrictedPlayingFieldSize(): Size {
    const height =
      Settings.rows * this.widthRestrictedCardSize.height +
      (Settings.rows + 1) * this.widthRestrictedGutterSize
    const width =
      Settings.columns * this.widthRestrictedCardSize.width +
      (Settings.columns + 1) * this.widthRestrictedGutterSize

    return {
      height: height,
      width: width,
    }
  }

  public getCardBoundary(position: PointInterface): Rectangle {
    const boundary = new Rectangle(
      position.x,
      position.x + this.cardSize.width,
      position.y,
      position.y + this.cardSize.height
    )

    return boundary
  }
}
