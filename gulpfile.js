var gulp = require("gulp");
var path = require("path");
var util = require("gulp-util");
var concat = require("gulp-concat");
var sourceMaps = require("gulp-sourcemaps");
var minifyCSS = require("gulp-minify-css");
var postcss = require("gulp-postcss");
var plumber = require("gulp-plumber");
var rename = require("gulp-rename");
var reporter = require("postcss-reporter")
var stylelint = require("stylelint");
var doiuse = require("doiuse");
var precss = require("precss")

var config = {
    isProduction: !!util.env.production,
    path : {
        css: "Content/**/*.css",
        js: "Content/**/*.js"
    },
    supportedBrowsers: [
        "last 2 version",
        "> 5% in ca", 
        "ie >= 8"
    ]
};

/* 
 * Tasks : Defaults
 */
gulp.task("default", ["watch","css"]);

/* 
 * Tasks : Watch
 */
gulp.task("watch", function() {
    gulp.watch([config.path.css], ["css"]);
});

/* 
 * Tasks : CSS
 */
gulp.task("css", function() {
  gulp.src(config.path.css, { cwd: process.cwd() })
  .pipe(plumber())
  .pipe(postcss([
        doiuse({
            browsers: config.supportedBrowsers,
            ignore: ["css-mediaqueries"]
        }),
        stylelint(
            {"extends": "./.stylelintrc"}
        ),
        precss(),
        reporter({ clearMessages: true })
    ]))
  .pipe(sourceMaps.init())
  .pipe(concat("project.name.css"))
  .pipe(minifyCSS())
  .pipe(rename({ suffix: ".min" }))
  // In dev write the sourceMaps 
  .pipe(config.isProduction ? util.noop() : sourceMaps.write())
  .pipe(gulp.dest("./build"))
});
