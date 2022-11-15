var gulp = require('gulp');
var install = require('gulp-install');

const PROD_DEST = './build';

// Copy the node_modules directory to /build directory so the lambda execute correctly with the dependencies
gulp.task('default', function () {
    return gulp.src(['./package.json'])
        .pipe(gulp.dest(PROD_DEST))
        .pipe(install({
            args: ['--only=production']
        }));
});