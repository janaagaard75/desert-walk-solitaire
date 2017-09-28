import { Card } from './Card'
import { Point } from './Point'

export interface DraggedCard {
  card: Card
  position: Point
}