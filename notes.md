# Notes

- Game.instance is a blessing because everything is always available.
- Game.instance is a curse because it's difficult too much is public.
- Very difficult to get the animation timings right. Clicking undo multiple times in a row should animate several cards at once.
- Would like to enable multiple undos. It is still very touch to get the solitaire to complete. That means that the game never ends because you can always undo. Could make it so that the last move ends the game, but that might feel unfair.
- Ended up never dragging cards, once it's possible to click.
- Keep the interface simple. Keep removing until you can't remove any more.
- `PositionedCards` is the same between moves. `EmptyCells` is a new array.
- `GridState` was introduced too late. It might be worth
- Difficult to get the object model correct, so that it is not possible to use it in a wrong way.