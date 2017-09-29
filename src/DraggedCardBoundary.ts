import { Card } from './Card'
import { Rectangle } from './Rectangle'

// TODO: Rename to BoundaryCardPair.
export interface DraggedCardBoundary {
  boundary: Rectangle
  card: Card
}