import { Card } from './Card'
import { Rectangle } from './Rectangle'

export interface DraggedCardBoundary {
  boundary: Rectangle
  card: Card
}