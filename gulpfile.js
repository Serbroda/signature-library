var gulp = require('gulp'); 
var concat = require('gulp-concat');

gulp.task('default', function() {
  return gulp.src([
        "./dist/point.js", 
        "./dist/canvas2d.js", 
        "./dist/signatureCanvas.js", 
        "./dist/signPad.js", 
        "./dist/textSignature.js"
    ])
    .pipe(concat('signature.js'))
    .pipe(gulp.dest('./dist/'));
});