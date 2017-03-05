const pidusage = require('pidusage');
const gameloop = require('..');

let fps = 60;
let intervalMs = 1000 / fps;

const loop = gameloop.setGameLoop(function(delta) {}, intervalMs);

let testCount = 0;

let memorySamples = [];

const count = 25;
console.log(`collecting samples for ${count} seconds`)
const interval = setInterval(function() {
	testCount += 1;

	pidusage.stat(process.pid, function(err, result) {
		memorySamples.push(result.memory);

		if (testCount == count) {
			let hasReduction = false

			console.log('memory usage:');
			console.log(memorySamples[0]);
			for (var i = 1; i < memorySamples.length; i++) {
				var memorySample = memorySamples[i];
				var delta = memorySample - memorySamples[i - 1];
				console.log(`${memorySample} (delta: ${delta})`);

				if (delta < 0) {
					hasReduction = true;
				}
			}

			if (hasReduction) {
				console.log('memory likely not leaking! :)');
			} else {
				console.log('memory may be leaking!');
				process.exit(1);
			}

			gameloop.clearGameLoop(loop);
			clearInterval(interval);
		}
	});
}, 1000);
