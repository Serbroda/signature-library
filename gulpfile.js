var { series, src, start, dest } = require("gulp");
var minify = require("gulp-minify");
var watch = require("gulp-watch");
var copy = require("gulp-copy");

function minifyJs() {
    return src("dist/js/signature.js")
        .pipe(
            minify({
                ext: {
                    min: ".min.js",
                },
            })
        )
        .pipe(dest("dist/js/"));
}

function watch() {
    return watch("./lib/**/*.js", function () {
        start("minify");
    });
}

function copyDocs() {
    return src("./dist/js/signature.min.js").pipe(
        copy("./docs/js", {
            prefix: 2,
        })
    );
}

exports.watch = watch;
exports.minify = minifyJs;
exports.build = minifyJs;
exports.copyDocs = copyDocs;
exports.default = series(minifyJs, copyDocs);
