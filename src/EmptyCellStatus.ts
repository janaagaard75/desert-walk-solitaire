// TODO: Rename to EmptyCellState.
export enum EmptyCellStatus {
  Blocked,
  DropAllowedButNoCardIsBeingDragged,
  DropAllowedButNotTargetableCell,
  MostOverlappedTargetableCell,
  TargetableCellButNotMostOverlapped,
}