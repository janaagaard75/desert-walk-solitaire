# Desert Walk

A game of solitare implemented in React Native and written in TypeScript.

## To Do

* Update engine, so that it can animate the cards between two states.
  * Add a currentlyDraggedCard property that keeps track of the card currently being dragged - if there is a card beging dragged.
  * When letting go of a card in a non-droppable place, let the engine snap the card back into position.
  * Use the engine to snap cards into correct positions.
  * Consider moving most of the calculations from the views to the models.

* Game lost screen.
* Game won screen.
  * Some kine of reward for winning.
* Prettier background.
* SVGs for the playing cards.
* Consider more data to the model objects, that is all observable properties and the sizes and positions of the elements.
* Disable shuffle button when it doesn't do anything.
* More affordable buttons.
* Splash screen.

* Keep track of the results for each game, that is: Number of moves, number of shuffles, number of cards in correct spot, datetime the game started, datetime the game ended.

## Fat Models

Keeping track of all the data is getting messing. The current architechture is to only keep the information necessary for the rules of the game, and leave all that has to do with presentation of the game in the view classes. It might be a better solution to move more information into the model, including what's required for drawing the interface, that is switch to an architechure with fat models.

The new architechture should support animating between two states, possibly shuffling multiple cards around, as they slide into their new positions. In the start and the end states the cards all have row and column indexes, but in between some of them are being animated. Keep the row and column index while the cards are animating, and update the cell positions once the animations are done.

Dragging a card:

1. game.draggedCard points to the card.
1. The dragged card's position is updated as it's being dragged.
1. The game class keeps track of the position, updating empty cells if necessary.
1. The card is let go when hovered over a droppable spot.
1. The engine calculates the upcoming game state.
1. The engine slides the card into the exact spot by using the position of the upcoming state.
1. After the animation is done, the old state is swapped out with the new one, resulting in updated empty spots and so on.