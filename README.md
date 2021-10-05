# Desert Walk

Solitaire card game implemented in React Native and written in TypeScript.

[desertwalk.janaagaard.com](https://desertwalk.janaagaard.com/)

## Prerequisites

- [Node.js](https://nodejs.org/en/).
- [Yarn](https://yarnpkg.com/en/).
- Recommended: iOS Simulator, part of [Xcode](https://developer.apple.com/xcode/).

## Running the App Locally

Just type `yarn start` to install the Node modules and start the app.

This opens a browser window where you can select 'Start iOS Simulator'.

You can also install the [Expo Client](https://expo.io/tools#client) on your devices and run the app through that app.

## TODO

- Fix the link to the privacy policy.
- Consider using [this singleton pattern](https://wanago.io/2019/11/11/javascript-design-patterns-1-singleton-and-the-module/#crayon-5e26b0cf71d61490784531).
- Remember the game state when the app is restarted.
- Make sure everything looks alright in all resolutions.
- Remove the text from the 'confirm restart dialog', so that the game only contains icons.
- Better colors. Dark mode by default?
- Game lost screen. How should it work, since it's always possible to undo a move?
- Animate the cards when they are dealt.
- A picture of a desert in the background of the cards?
- Make the icons look more like buttons.
- Small animation when a card is moved into the correct position. Could be a small shine effect like the one on records in the Moves app. Pixel art example: <https://i.imgur.com/oLmT5Ot.gif>.
- Avoid passing inline functions as props: <https://itnext.io/how-we-boosted-the-performance-of-our-react-native-app-191b8d338347#e92b>.

## Assets

- Photo used as background in the icon: [Photo by Carl Larson from Pexels](https://www.pexels.com/photo/saraha-desert-1123567/).
- Font: [XXII Arabian Onenightstand](http://www.dafont.com/xxii-arabian-onenightstand.font?text=Desert+Walk+A+2+3+4+5+6+7+8+9+10+J+Q+K).
- The background image is based on [pat by florc](http://www.colourlovers.com/pattern/50713/pat) pattern image. That images has the [Attribution-ShareAlike 3.0 Unported (CC BY-SA 3.0)](https://creativecommons.org/licenses/by-nc-sa/3.0/) license, so so does the modified one in this repo.

## Deploying a new version

It's necessary to deploy a new version when updating the Expo SDK, and also in a [handful more cases](https://docs.expo.io/versions/v36.0.0/workflow/publishing/#limitations).

1. Increment `buildNumber` and `versionCode` in `app.json`.
2. Bump `version` in `app.json` and `package.json`.
3. Run `yarn build-ios` to queue a build.
4. Download the `.ipa` from [expo.io/dashboard/janaagaard75](https://expo.io/dashboard/janaagaard75).
5. Use the [Transporter Mac app](https://apps.apple.com/app/transporter/id1450874784) to upload the file.
6. Go to [appstoreconnect.apple.com](https://appstoreconnect.apple.com/) and create a new version.
7. Invite App Store Connected Users to test the new version.
8. Use the link in the mail to import the app in TestFlight and install it.
9. Test the app on the device.
10. Add notes about new features and select the build App Store Connect. Selecting the build will add the icon.
11. Submit for review.
12. Answer _Yes_ to 'Does this app use the Advertising Identifier (IDFA)'?, and check the three boxes except 'Serve advertisements within the app'. [Source](https://segment.com/docs/connections/sources/catalog/libraries/mobile/ios/quickstart/#step-5-submitting-to-the-app-store).

Certificate for push notifications: <https://github.com/expo/turtle/issues/62#issuecomment-469528206>.

## Known and Unknown Packages

Known packages: react-native-svg, expo-font, expo-screen-orientation, react-native, react, typescript, @types/react, babel-preset-expo, @types/react-native, expo.

Unknown packages: mobx, mobx-react, tslib, @types/expo\_\_vector-icons, @typescript-eslint/eslint-plugin, @typescript-eslint/parser, eslint, eslint-config-prettier, eslint-plugin-react, expo-cli, prettier

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

`PositionedCards` remain the same between moves. `EmptyCells` is a new array. I should have realized this much earlier.

It's a code smell that the `CardCellPair` interface is required. This may be because the inheritance in the model is wrong.

The `Game` class has become too big. It might be possible to extract some of the code into a `Main` class and to move some of the code to `GridState`.

It's okay to have observable values inside views. Too many things has been stored in Settings.

The syntax for observable variables is heavy.

Naming things is important as ever. A bug was created because `targetableCells` included in the cell being moved from to get the overlap calculations correct, but the name had not been updated.

MobX now checks for side effects inside observables.

The UI of a game is complicated because everything is custom made.

The ability to undo back and forth required a more complex model that originally anticipated. This hasn't been modelled as nicely as it could, and the increased complexity makes it difficult to make changes to the game without cause bugs. It would probably be worth the effort of starting over before adding major new features like difficulty selector.

I create a demo app where I tested a few of the animation setup. This revealed some major logical errors in the code that handles the animations and allowed me to clean up that part.

[SafeAreaView](https://docs.expo.io/versions/v32.0.0/react-native/safeareaview/) reserves too much space at the bottom, so it doesn't look nice.

## Links

<https://blog.cloudboost.io/3-reasons-why-i-stopped-using-react-setstate-ab73fc67a42e>
