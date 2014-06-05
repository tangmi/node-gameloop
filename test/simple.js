var usage = require('usage');

var gameloop = require('..');

gameloop.setGameLoop(function(delta) {
	console.log('delta=%s', delta)
}, 1000 / 30);

var testCount = 0,
	totalCpu = 0;;
setInterval(function() {
	testCount++;
	usage.lookup(process.pid, function(err, result) {
		console.log('sample %s cpu: %s%%', testCount, result.cpu);
		totalCpu += result.cpu;
		if (testCount == 3) {
			console.log('average cpu over %s seconds: %s%%', testCount, totalCpu / testCount);
			process.exit(0);
		}
	});
}, 1000);