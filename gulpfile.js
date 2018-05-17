var gulp = require('gulp'); 
var concat = require('gulp-concat');
var minify = require('gulp-minify');
var watch = require('gulp-watch');

gulp.task('bundle', function() {
  return gulp.src([
        "./lib/point.js", 
        "./lib/canvas2d.js", 
        "./lib/signatureCanvas.js", 
        "./lib/signPad.js", 
        "./lib/textSignature.js"
    ])
    .pipe(concat('signature.js'))
    .pipe(gulp.dest('./dist/js/'));
});

gulp.task('minify', ['bundle'], function() {
    return gulp.src("./dist/js/signature.js")
        .pipe(minify({
            ext: {
                min:'.min.js'
            },
            exclude: ['tasks'],
            ignoreFiles: ['.combo.js', '-min.js']
        }))
        .pipe(gulp.dest('./dist/js'));
});

gulp.task('watch', function() {
    return watch('./lib/**/*.js', function() {
        gulp.start('minify');
    });
});
