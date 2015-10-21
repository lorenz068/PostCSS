var gulp = require("gulp");
var path = require("path");
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
    isDev: !!util.env.dev,
    ressource : "Content",
    destination : "./Build",
    supportedBrowsers: [
        "last 2 version",
        "> 5% in ca", 
        "ie >= 8"
    ]
};

/* 
 * Tasks : Defaults
 */
gulp.task("default", ["watch","cssApp","cssExternal"]);

/* 
 * Tasks : Watch
 */
gulp.task("watch", function() {
    gulp.watch([config.ressource + "/Css/App/**/*.css" ], ["cssApp"]);
    gulp.watch([config.ressource + "/Css/External/**/*.css" ], ["cssExternal"]);
});

/* 
 * Tasks : CSS App
 */
gulp.task("cssApp", function() {
  gulp.src([config.ressource + "/Css/App/**/*.css" ], { cwd: process.cwd() })
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
  .pipe(concat("project.app.css"))
  
  // In dev write the sourceMaps
  .pipe(minifyCSS())
  .pipe(config.isDev ? sourceMaps.write() : util.noop())
  .pipe(gulp.dest(config.destination))
});

/* 
 * Tasks : CSS External
 */
gulp.task("cssExternal", function() {
  gulp.src([config.ressource + "/Css/External/**/*.css" ], { cwd: process.cwd() })
  .pipe(plumber())
  .pipe(sourceMaps.init())
  .pipe(concat("project.external.css"))
  
  // In dev write the sourceMaps
  .pipe(minifyCSS())
  .pipe(config.isDev ? sourceMaps.write() : util.noop())
  .pipe(gulp.dest(config.destination))
});
