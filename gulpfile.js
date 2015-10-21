var gulp = require("gulp");
var util = require("gulp-util");
var concat = require("gulp-concat");
var sourceMaps = require("gulp-sourcemaps");
var minifyCSS = require("gulp-minify-css");
var postcss = require("gulp-postcss");
var plumber = require("gulp-plumber");
var reporter = require("postcss-reporter")
var stylelint = require("stylelint");
var doiuse = require("doiuse");
var precss = require("precss")

var config = {
    production: !!util.env.production,
    source : {
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
    gulp.watch([config.source.css], ["css"]);
});

/* 
 * Tasks : CSS
 */
gulp.task("css", function() {
  gulp.src(config.source.css, { cwd: process.cwd() })
  .pipe(plumber())
  .pipe(postcss(
      [
        doiuse({
            browsers: config.supportedBrowsers,
            ignore: ["css-mediaqueries"]
        }),
        stylelint(
            {"extends": "./.stylelintrc"}
        ),
        precss(),
        reporter({ clearMessages: true })
    ]
  ))
  
  .pipe(sourceMaps.init())
  .pipe(concat("all.css"))
  .pipe(config.production ? minifyCSS() : util.noop())
  .pipe(sourceMaps.write())
  .pipe(gulp.dest("./build"))
});
