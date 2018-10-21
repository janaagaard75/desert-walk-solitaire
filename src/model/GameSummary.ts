import * as firebase from 'firebase'
import { Settings } from './Settings'

import * as firebaseConfig from './firebaseConfig.json'

interface GameSummaryStep {
  cardsInPlace: number,
  moves: number
}

export class GameSummary {
  public GameSummary() {
    if (firebase.apps.length === 0) {
      firebase.initializeApp(firebaseConfig)
    }
  }

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

  public storeGameSummary() {
    if (firebase.database === undefined) {
      throw new Error('firebase.database has to be defined.')
    }

    firebase.database().ref('gameSummaries').push(this)
  }
}