import { Card } from './Card'
import { Point } from './Point'

// TODO: Find a better name for this. DraggedCardPosition?
export interface DraggedCard {
  card: Card
  position: Point
}