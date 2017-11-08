
const gulp = require('gulp');
const plugins = require('gulp-load-plugins')();
gulp.task('build:html', function () {
    gulp.src(path.src.html)
        .pipe(plugins.plumber({
            errorHandler: plugins.notify.onError(function (err) {
                return {
                    title: 'Build html error',
                    message: err.message
                }
            })
        }))
        .pipe(debug({ title: 'src' }))
        // .pipe(changed(path.dev.htmlDest))
        .pipe(rigger())// uses construction   //= footer.html  to add partils 
        .pipe(debug({ title: 'rigger' }))
        // .pipe(minifyHTML(opts))
        .pipe(gulp.dest(path.dev.htmlDest))
        .pipe(debug({ title: 'dest' }))
        .pipe(reload({ stream: true }));
});