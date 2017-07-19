# Desert Walk

A game of solitare implemented in React Native and written in TypeScript.

## To Do

Figure out how to position elements that are being dragged above the other elements. Setting a higher z-index when dragging only fixes the overlay issue for the current row, and not the rows below. Giving the cards a single parent element means loosing the simplicity of using Flexbox for laying out the cards. `position: static` isn't allowed in React Native, so it might be that all elements are positioned as either relative or absolute.

Proposition: Let the App component know what card is being dragged, so that this card can be drawn in another layer. This will require that it is possible to move the card between layers while keeping the position.