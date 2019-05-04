# Desert Walk

Solitaire implemented in React Native and written in TypeScript.

## Prerequisites

- [Node.js](https://nodejs.org/en/).
- [Yarn](https://yarnpkg.com/en/).
- Recommended: iOS Simulator, part of [Xcode](https://developer.apple.com/xcode/).

## Running the App Locally

Just type `yarn start` to install the Node modules and start the app.

This opens a browser window where you can select 'Start iOS Simulator'.

You can also install the [Expo Client](https://expo.io/tools#client) on your devices and run the app through that app.

## TODO

- Fix screen orientation after showing the confirm dialog.
- Remember the game state when the app is restarted.
- Publish on iOS.

### Later

- Make sure everything looks alight on Android.
- Publish on Android.
- Taller footer on tablets.
- Remove the text from the 'confirm restart dialog', so that the game only contains icons.
- Better colors. Dark mode by default?
- Game lost screen. How should it work, since it's always possible to undo a move?
- Enable portrait mode on tablets.
- Animate the cards when they are dealt.
- A picture of a desert in the background of the cards?
- Make the icons look more like buttons.
- Small animation when a card is moved into the correct position. Could be a small shine effect like the one on records in the Moves app. Pixel art example: <https://i.imgur.com/oLmT5Ot.gif>.
- Avoid passing inline functions as props: <https://itnext.io/how-we-boosted-the-performance-of-our-react-native-app-191b8d338347#e92b>.

## Logo

[Free Arabic looking fonts](http://www.dafont.com/theme.php?cat=202&text=Desert+Walk+1234567890+AKQJ&l[]=10&l[]=1). Top candidates:

- [Tafakur](http://www.dafont.com/tafakur.font?text=Desert+Walk+A+2+3+4+5+6+7+8+9+10+K+Q+J&fpp=100&l[]=10&l[]=1)
- [Nurkholis](http://www.dafont.com/nurkholis.font?text=Desert+Walk+A+2+3+4+5+6+7+8+9+10+K+Q+J&fpp=100&l[]=10&l[]=1)
- [Aceh Darusalam](http://www.dafont.com/aceh-darusalam.font?text=Desert+Walk+A+2+3+4+5+6+7+8+9+10+K+Q+J&fpp=100&l[]=10&l[]=1)
- [XXII Arabian Onenightstand](http://www.dafont.com/xxii-arabian-onenightstand.font?text=Desert+Walk+A+2+3+4+5+6+7+8+9+10+J+Q+K)

## Learnings

Adding undo/redo and cleaning up the data model was difficult. Having switched to a @computed based model simplified things. However there is still some code leftover from the previous model, meaning that the currently solution could be simplified and optimized.

TypeScript does not catch all errors. There are no compiler errors when checking if two different classes are equal, even though the result will always be false.

Having singleton classes (Game, Settings, Deck and Grid) is the same as making every component a connected component, meaning the cleanliness of having pure components that only depend on their props is gone. Singleton classes make it harder to spot if the model is on the right track, since having a lot of the model globally available easily leads to spaghetti code.

Creating a good model is difficult. It might be a good idea to move the dragged card from Game to GridState.

Creating meaningful names is a difficult but important task. Card has been renamed at least five times, and it still needs a rename, since it focuses on the cards and not the cells. Perhaps going back to PositionedCard? When a class is renamed, there are often local variables left, that should also be renamed. Card and EmptyCell makes for a great pair, but the two classes are distinct in that when switching between states, the cards are all the same only moved, whereas the empty cells are removed and added.

The first data architecture kept only the game logic with the model, while leaving the presentation of the game to the view classes. That got messy, so the new architecture puts everything inside the models. Most properties are computed values. Making Settings, Game, Deck and Grid singletons has lead to somewhat a spaghetti code architecture, but currently it's okay. That might actually be the force of MobX: Embrace the spaghetti architecture, and avoid drowning in it.

Right now the models are separated from the views, but this actually not be a good idea where there is a one-to-one relation between model and view, as with for example the cards.

It is probably wise to go all in on MobX and remove all setState calls from the application.

Designing for the iPhone X is tricky for two reasons: 1) it has rounded corners, so you can get buttons that are cut off and 2) it has a bar at the bottom of the screen to close the app. The design has to take account of both things manually.

Using computed values everywhere is too much. The resulting code is that no methods take any arguments, and this is only possible because `Game` is a singleton. It does, however, lead to spaghetti code, since everything becomes available globally. Using `Game.instance` in the views is fine, but it is not in the model classes.

It's very difficult to get the animation timings right. Clicking undo multiple times in a row should animate several cards at once.

Having the undo button means that the game never ends.

Now that it is possible to move cards by clicking on them, I am no longer dragging them. It's nice that's it's possible to do both, but allowing dragging of cards could definitely have been left out. The animation of the cards is very important to let the user know what is going on.

Keep the interface simple. Keep removing until you can't remove any more.

`PositionedCards` remain the same between moves. `EmptyCells` is a new array.

It's a code smell that the `CardCellPair` interface is required. This may be because the inheritance in the model is wrong.

The `Game` class has become too big. It might be possible to extract some of the code into a `Main` class and to move some of the code to `GridState`.

It's okay to have observable values inside views. Too many things has been stored in Settings.

The syntax for observable variables is heavy.

Naming things is important as ever. A bug was created because `targetableCells` included in the cell being moved from to get the overlap calculations correct, but the name had not been updated.

MobX now checks for side effects inside observables.

The UI of a game is complicated because everything is custom made.

## Links

<https://blog.cloudboost.io/3-reasons-why-i-stopped-using-react-setstate-ab73fc67a42e>
