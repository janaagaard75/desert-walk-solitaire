import { Settings } from './Settings'

interface GameSummaryStep {
  cardsInPlace: number,
  moves: number
}

export class GameSummary {
  public ended: number = -1
  public maxCardValue: number = Settings.instance.maxCardValue
  public started: number = Date.now()
  public steps: Array<GameSummaryStep> = []

  public addStep(step: GameSummaryStep) {
    this.steps.push(step)
  }

  public addFinalStep(step: GameSummaryStep) {
    this.addStep(step)
    this.ended = Date.now()
  }
}