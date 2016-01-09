var gulp = require('gulp');
var fs = require('fs');

var browserify = require('browserify');
var boot = require('loopback-boot');

var appDir = __dirname;

gulp.task('default', function(done) {
	var b = browserify({
	  basedir: appDir,
	});
	 
	// add the main application file
	b.require('./client.js', { expose: 'loopback-app' });
	 
	// add boot instructions
	boot.compileToBrowserify(appDir, b);
	 
	// create the bundle
	var out = fs.createWriteStream('bundle.js');
	b.bundle().pipe(out);
	
	done();
});
