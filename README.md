# Desert Walk

Solitaire implemented in React Native and written in TypeScript.

## Running the App Locally

1. Fetch the repo and install packages with `yarn install` (or `npm install`).
2. Download and install the [Expo XDE](https://expo.io/tools).
3. (Not sure if this is mandatory: Install XCode on Mac. The iOS Simulator is part of XCode.)
4. Open the project in Expo XDE. This should compile everything.
5. Open the project in the iOS simulator\* or...
6. ...Install the Expo client on a mobile device and scan the QR code revealed by the Share button.

\*) It also possible to run the app in Android simulator, but I have not tried that yet.

## TODO

- Avoid passing inline functions as props: <https://itnext.io/how-we-boosted-the-performance-of-our-react-native-app-191b8d338347#e92b>.
- Game lost screen.
- Redesign the cards.
  - Remove the small suits and use the whole card for the number and the suit.
  - Replace J, Q and K with symbols?
- Better colors. Dark mode by default?
- Draw the numbers on the cards using a custom font or SVGs.
- Splash screen.
- Make sure everything looks alike on both platforms.
- Use standard undo and redo icons.
- Need a better icon for starting over the game.
- The start over button is always clickable, but it should also be highlighted when the game is in game over mode. So that icon needs two states of highlight.
- Make the icons look more like buttons.
- Remove the text from the 'confirm restart dialog', so that the game only contains icons.
- Remember the game state even when the app has been closed for a long time.
- A picture of a desert in the background of the cards?
- Enable portrait mode on tablets.
- Publish on iOS.
- Publish on Android.

### Later

- Animate the cards when they are dealt.
- Small animation when a card is moved into the correct position. Could be a small shine effect like the one on records in the Moves app. Pixel art example: <https://i.imgur.com/oLmT5Ot.gif>.

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

## Links

<https://blog.cloudboost.io/3-reasons-why-i-stopped-using-react-setstate-ab73fc67a42e>
