// Taken and modified from https://github.com/tangmi/node-gameloop
// ...which was taken and modified from https://github.com/timetocode/node-game-loop
let activeLoops = [];

const getLoopId = (function() {
	let staticLoopId = 0;

	return function() {
		return staticLoopId++;
	}
})();

function getNano(hrtime) {
	return ((+hrtime[0]) * 1e9 +hrtime[1]);
}

const ms2nano = 1000000;
const intervalMs = 5;
const intervalNano = intervalMs * ms2nano;

module.exports.setGameLoop = function(update, tickLengthMs) {
	let loopId = getLoopId();
	activeLoops.push(loopId);

	/**
	 * Length of a tick in milliseconds. The denominator is your desired framerate.
	 * e.g. 1000 / 20 = 20 fps, 1000 / 60 = 60 fps
	 */
	tickLengthMs = tickLengthMs || 1000 / 30;

	// convert to nano
	const tickLengthNano = tickLengthMs * ms2nano;

	const tickIntervalDiff = tickLengthNano - intervalNano;

	/* gameLoop related variables */
	// timestamp of each loop
	let previousTick = getNano(process.hrtime());
	// number of times gameLoop gets called
	let actualTicks = 0;

	const gameLoop = function() {
		actualTicks++;

		const now = getNano(process.hrtime());
		const delta = now - previousTick

		if (delta >= tickLengthNano) {
			previousTick = now;

			// actually run user code
			update(delta / 1e9);

			actualTicks = 0;
		}

		// do not go on to renew loop if no longer active
		if (activeLoops.indexOf(loopId) === -1) {
			return;
		}

		// otherwise renew loop in 16ms multiples, or immediately
		if ((getNano(process.hrtime()) - previousTick) < tickIntervalDiff) {
			setTimeout(gameLoop, intervalMs);
		} else {
			setImmediate(gameLoop);
		}
	}

	// begin the loop!
	gameLoop();

	return loopId;
};

module.exports.clearGameLoop = function(loopId) {
	// remove the loop id from the active loops
	activeLoops.splice(activeLoops.indexOf(loopId), 1);
};
