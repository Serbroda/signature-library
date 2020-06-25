var { series, src, start, dest } = require("gulp");
var concat = require("gulp-concat");
var minify = require("gulp-minify");
var watch = require("gulp-watch");
var copy = require("gulp-copy");

function bundle() {
    return src(["lib/**.js"]).pipe(concat("signature.js")).pipe(dest("dist/js/"));
}

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
    return src("./dist/js/signature.js").pipe(
        copy("./docs/js", {
            prefix: 2,
        })
    );
}

exports.watch = watch;
exports.bundle = bundle;
exports.minify = minifyJs;
exports.build = series(bundle, minifyJs);
exports.copyDocs = copyDocs;
exports.default = series(bundle, minifyJs, copyDocs);
