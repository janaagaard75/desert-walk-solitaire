# Desert Walk

A game of solitare implemented in React Native and written in TypeScript.

Published through Expo: <https://expo.io/@janaagaard75/desert-walk>.

## To Do

* Update engine, so that it can animate the cards between two states.
  * When letting go of a card in a non-droppable place, let the engine snap the card back into position.
  * Use the engine to snap cards into correct positions.
  * Animate shuffling the cards.
  * Consider animating that the cards are delt. This will also maje it clearer what happens when the cards arw shuffled, and make it possible to show an animation, should the cards coincidally be redlet in the exact same position as they were before.
* Consider making the Game class a singleton, put Deck and Grid into it, and generally avoid passing things down with props, unless necessary.
* Game lost screen.
* Game won screen.
  * Some kine of reward for winning. Show a fast replay?
* Small animation when a card is moved into the correct position.
  * Animate cards before shuffleling?
  * Animate all cards when the game is won.
* Prettier background.
* SVGs for the playing cards, since iOS and Android have different fonts.
* Consider more data to the model objects, that is all observable properties and the sizes and positions of the elements.
* Disable shuffle button when it doesn't do anything.
* More affordable buttons.
* Splash screen.
* Fix starting up the game while the phone is in landscape mode.

### Animating Between States

Animating between two grid states is still to do. It should be possible to send a 'from' and a 'to' grid state to GridStateView, and let the view animate appropriately.

For each card: Animate from the position of the 'from' state to the position of the 'to' state.

It might be worth moving the dragged card observables from Game to GridState, because then snapping a dropped card into position could be handled by the engine.

## Fat Models

The first data architechture was to only keep the information necessary for the rules of the game in the models, and leave all that has to do with presentation of the game to the view classes. That got messy, so the new architechture is to put pretty much everything in the models. Most of the properties are computed values. Making Settings, Game, Deck and Grid singletons has lead to somewhat a spaghetti code architechture, but currently it's okay. That might actually be the force of MobX: Embrace the spaghetti architecture, and avoid drowning in it.

## Dragging a Card

1. The observables game.draggingFromCell and game.draggedCardBoundary are set.
1. The dragged card's boundary is updated as it's being dragged.
1. Everything flows as computed values based on these two observables.
1. If the card is let go in a non-droppable spot, OccupiedCellView puts it back, and does so with a small animation.
1. If the card is let go when overlapping a droppable cell, a new grid state is calculated, added to the array of states, and the current grid state then points to the newly added state.

## Logo

[Free Arabic lookings fonts](http://www.dafont.com/theme.php?cat=202&text=Desert+Walk+1234567890+AKQJ&l[]=10&l[]=1). Top candidates:

* [Tafakur](http://www.dafont.com/tafakur.font?text=Desert+Walk+A+2+3+4+5+6+7+8+9+10+K+Q+J&fpp=100&l[]=10&l[]=1)
* [Nurkholis](http://www.dafont.com/nurkholis.font?text=Desert+Walk+A+2+3+4+5+6+7+8+9+10+K+Q+J&fpp=100&l[]=10&l[]=1)
* [Aceh Darusalam](http://www.dafont.com/aceh-darusalam.font?text=Desert+Walk+A+2+3+4+5+6+7+8+9+10+K+Q+J&fpp=100&l[]=10&l[]=1)
* [XXII Arabian Onenightstand](http://www.dafont.com/xxii-arabian-onenightstand.font?text=Desert+Walk+A+2+3+4+5+6+7+8+9+10+J+Q+K)

## Learnings

Adding undo/redo and the subsequent cleanup of the datamodel was difficult. Having switched to a primarely @computed based model is nice, but there are probably still leftovers for the previous code, meaning that the currently solution could be simplified and optimized.

TypeScript is nice, but it doesn't catch all errors. Specifically there are apparently no compiler errors when checking if two different classes are equal, even though the result will always be false.

Having singleton classes (Game, Settings, Deck and Grid) is essentially the same as making every component a connected component, and that means that the cleanness of having pure components that only depend on their props is gone. The singleton classes also makes is harder to spot if the model is on the right track, since having a lot of the model globally avaiable easily leads to spaghetti code.

Creating a good model is difficult. It might be a good idea to move the dragged card from Game to GridState.

Naming things is hard, but important. OccupiedCell has been renamed at least five times. When a class is renamed, there are often local variables left, that should also be renamed.

## Links

<https://blog.cloudboost.io/3-reasons-why-i-stopped-using-react-setstate-ab73fc67a42e>