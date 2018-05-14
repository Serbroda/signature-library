var gulp = require('gulp'); 
var concat = require('gulp-concat');
var minify = require('gulp-minify');

gulp.task('bundle', function() {
  return gulp.src([
        "./lib/point.js", 
        "./lib/canvas2d.js", 
        "./lib/signatureCanvas.js", 
        "./lib/signPad.js", 
        "./lib/textSignature.js"
    ])
    .pipe(concat('signature.js'))
    .pipe(gulp.dest('./dist/'));
});

gulp.task('minify', function() {
    return gulp.src("./dist/signature.js")
        .pipe(minify({
            ext: {
                min:'.min.js'
            },
            exclude: ['tasks'],
            ignoreFiles: ['.combo.js', '-min.js']
        }))
        .pipe(gulp.dest('./dist'));
});