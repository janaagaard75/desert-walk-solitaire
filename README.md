# Desert Walk

A game of solitare implemented in React Native and written in TypeScript.

## To Do

* Update engine, so that it can animate the cards between two states.
  * Remove CellView, since the cards shouldn't be redrawn once they are displayed.
  * Add a currentlyDraggedCard property that keeps track of the card currently being dragged - if there is a card beging dragged.
  * When letting go of a card in a non-droppable place, let the engine snap the card back into position.
  * Use the engine to snap cards into correct positions.

* Game lost screen.
* Game won screen.
* Prettier background.
* SVGs for the playing cards.
* Consider more data to the model objects, that is all observable properties and the sizes and positions of the elements.
* Disable shuffle button when it doesn't do anything.
* More affordable buttons.
* Splash screen.

* Keep track of the results for each game, that is: Number of moves, number of shuffles, number of cards in correct spot, datetime the game started, datetime the game ended.