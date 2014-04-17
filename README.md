# node-gameloop

A game loop designed by [timetocode](https://github.com/timetocode) for NodeJS applications. Uses a combination of `setTimeout` and `setImmediate` to achieve accurate update ticks with minimal CPU usage.

## Example

`node-gameloop` uses an API very similar to `setTimeout`/`setInterval`, returning an ID that can be used to clear the game loop later.

```js
var gameloop = require('node-gameloop');

// start the loop at 30 fps (1000/30ms per frame) and grab its id
var frameCount = 0;
var id = gameloop.setGameLoop(function(delta) {
	console.log('Hi there! (frame=%s, delta=%s)', frameCount++, delta);
}, 1000 / 30);

// stop the loop 2 seconds later
setTimeout(function() {
	console.log('2000ms passed, stopping the game loop');
	gameloop.clearGameLoop(id);
}, 2000);
```