// increment patch version number
var fs = require('fs');
var exec = require('child_process').exec;

var package = require('../package.json'),
	version = package.version;

console.log('');
console.log('POSTPUBLISH: started');
console.log('');

var oldversion = version;

var regex = new RegExp(/([0-9]\.[0-9]\.)([0-9])/);

var first = version.replace(regex, '$1');
var minor = version.replace(regex, '$2');

package.version = first + (parseInt(minor) + 1);

fs.writeFile('package.json', JSON.stringify(package, null, '\t'), function(err) {

	console.log('Incrementing', package.name, 'version from', oldversion, 'to', package.version);
	commit(package.version);
});

function commit(version) {
	var commitMessage = 'Release ' + oldversion;
	exec('git add package.json', function(error, stdout, stderr) {
		console.log('');
		console.log('Commiting package.json: "' + commitMessage + '"');

		exec('git commit -m "' + commitMessage + '"', function(error, stdout, stderr) {
			if (!stderr) {
				console.log('Git commit successful');
			}
			afterPostpublish();
		});

	});
}

function afterPostpublish() {
	console.log('');
	console.log('POSTPUBLISH: finished');
	console.log('');
}