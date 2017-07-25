export enum CellStatus {
  EmptyAndDraggedCardIsDroppable,
  EmptyAndDraggedCardNotDroppable,
  EmptyAndDropPossible,
  EmptyButBlockedByKing,
  EmptyButEmptyCardToTheLeft,
  OccupiedByCardInCorrectPlace,
  OccupiedByCardInWrongPlace
}