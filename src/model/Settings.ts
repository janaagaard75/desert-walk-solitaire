export class Settings {
  public static readonly animation = {
    replay: {
      delayBeforeAutoReplay: 500,
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

  public static readonly colors = {
    card: {
      background: "#fff",
      border: "#000",
      clubs: "#018804",
      diamonds: "#211ae9",
      hearts: "#ea0001",
      shadowColor: "#000",
      spades: "#0e0e0e"
    },
    gridBackgroundColor: "#464",
    mainBackgroundColor: "#333"
  }

  public static readonly cardShadowOpacity = 0.6
  public static readonly maxCardValue = 13
  public static readonly numberOfShuffles = 3
  public static readonly rows = 4

  public static readonly columns = Settings.maxCardValue + 1
  public static readonly numberOfCards = Settings.maxCardValue * Settings.rows
}
