var gulp = require('gulp');
var runSequence = require('run-sequence');
var config = require('../config');

gulp.task('build', function(cb) {
    runSequence('clean', ['browserify', 'sass', 'markup', 'fonts'], cb);
});

gulp.task('build-release', function() {
    config.browserify.debug = false;
    gulp.start('build');
});