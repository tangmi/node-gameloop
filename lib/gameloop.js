// Taken and modified from https://github.com/timetocode/node-game-loop
// Thanks to https://github.com/norlin/node-gameloop for making this faster

let activeLoops = [];

const getLoopId = (function() {
	let staticLoopId = 0;

	return function() {
		return staticLoopId++;
	}
})();

function getNano(hrtime) {
	return (+hrtime[0]) * s2nano + (+hrtime[1]);
}

const s2nano = 1e9;
const nano2s = 1 / s2nano; // avoid a divide later, although maybe not nessecary
const ms2nano = 1e6;

// loop will refresh no sooner than `minRefreshInvervalMs` ms
const minRefreshInvervalMs = 5;

// note: "tick" and "frame" can be used interchangably here
module.exports.setGameLoop = function(update, tickLengthMs) {
	let loopId = getLoopId();
	activeLoops.push(loopId);

	/**
	 * Length of a tick in milliseconds. The denominator is your desired framerate.
	 * e.g. 1000 / 20 = 20 fps, 1000 / 60 = 60 fps
	 */
	tickLengthMs = tickLengthMs || 1000 / 30;

	// expected tick length
	const tickLengthNano = tickLengthMs * ms2nano;

	// convert this to an integer since we don't need the precision of frational nanoseconds
	const tickIntervalDiff = Math.floor(tickLengthNano - (minRefreshInvervalMs * ms2nano));

	/* gameLoop related variables */
	// timestamp of each loop
	let previousTick = getNano(process.hrtime());
	// actual number of ticks between updates
	let actualTicks = 0;

	const gameLoop = function() {
		actualTicks++;

		const now = getNano(process.hrtime());
		const delta = now - previousTick;

		if (delta >= tickLengthNano) {
			previousTick = now;

			// actually run user code
			update(delta * nano2s);

			actualTicks = 0;
		}

		// do not go on to renew loop if no longer active
		if (activeLoops.indexOf(loopId) === -1) {
			return;
		}

		// if we have >`minRefreshInvervalMs` time remaining, wait that long, otherwise renew immediately
		if (delta < tickIntervalDiff) {
			setTimeout(gameLoop, minRefreshInvervalMs);
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