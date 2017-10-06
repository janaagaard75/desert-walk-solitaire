import { GridState } from './GridState'

export abstract class Turn {
  public abstract performTurn(gridState: GridState): GridState
}