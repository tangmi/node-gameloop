const pidusage = require('pidusage');
const gameloop = require('..');

let totalDelta = 0;
let testRuns = 0;

let fps = 60;
let intervalMs = 1000 / fps;

const loop = gameloop.setGameLoop(function(delta) {
	console.log(`delta=${delta}`);

	totalDelta += delta;
	testRuns += 1;
}, intervalMs);

let testCount = 0;
let totalCpu = 0;

const interval = setInterval(function() {
	testCount += 1;

	pidusage.stat(process.pid, function(err, result) {
		totalCpu += result.cpu;

		if (testCount == 10) {
			let avgDelta = totalDelta / testRuns;
			let targetDelta =
			console.log(`Test runs: ${testRuns}`);
			console.log(`target delta : ${intervalMs/1000}s`);
			console.log(`average delta: ${avgDelta}s`);
			console.log(`average cpu over ${testCount} seconds: ${totalCpu / testCount}%`);

			gameloop.clearGameLoop(loop);
			clearInterval(interval);
		}
	});
}, 1000);
