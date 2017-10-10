import { Card } from './Card'
import { Rectangle } from './Rectangle'

// TODO: Create a class instead.
export interface DraggedCard {
  boundary: Rectangle
  card: Card
}