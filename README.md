# Pentago: an online app version of the connect 5 game

 I develop an easy implementation of the [Pentago](https://en.wikipedia.org/wiki/Pentago) board game using  `react.js`. The source code is divided in a script and css style files named `index.css` and `index.js`. `index.js` is based on the example in the [react tutorial](https://es.reactjs.org/tutorial/tutorial.html).
 
 
 
 
 ## Game instructions
 
 Pentago is basically like a tic-tac-toe game, but with two differences.
 
 1. The board has a 6x6 squares board and, to win, the player has to connect 5 marbles (circles and crosses) either vertically, horizontally or in diagonal.
 
 2. The board is divided in 4 3x3 sub-boards which can be rotated. After each move, the players have to rotate one of the sub-boards 90 degrees clock or anticlockwise.
 
 
 The winner is the first player to connect 5 of their marbles before or after the 90 degrees rotation. Note, that a rotation of one player could give the victory to the other (upsy daisy!!!!)
 



<figure>
  <img src="https://upload.wikimedia.org/wikipedia/commons/b/be/Pentago-Game-Winning-Position.jpg" 
alt="Pentago" width="240" height="180" border="10" />
  <figcaption>The Pentago board</figcaption>
</figure>
