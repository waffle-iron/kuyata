var gulp = require('gulp');
var browserSync = require('browser-sync');
var config = require('../config').browsersync;

// Static server
gulp.task('browser-sync', function() {
    browserSync({
        server: {
            baseDir: config.baseDir
        }
    });
});
