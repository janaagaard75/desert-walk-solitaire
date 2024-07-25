export type EmptyCellState =
  | "blocked"
  | "dropAllowedButNoCardIsBeingDragged"
  | "dropAllowedButNotTargetableCell"
  | "mostOverlappedTargetableCell"
  | "targetableCellButNotMostOverlapped";
