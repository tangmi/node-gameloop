var gameloop = require('node-gameloop');

// start the loop at 30 fps (1000/30ms per frame) and grab its id
var frameCount = 0;
var id = gameloop.setGameLoop(function(delta) {
	// `delta` is the delta time from the last frame
	console.log('Hi there! (frame=%s, delta=%s)', frameCount++, delta);
}, 1000 / 30);

// stop the loop 2 seconds later
setTimeout(function() {
	console.log('2000ms passed, stopping the game loop');
	gameloop.clearGameLoop(id);
}, 2000);