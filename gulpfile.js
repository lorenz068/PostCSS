// Add dependencies
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

// Check environnement
var isDev = !!util.env.dev

// Config of the App
var config = {
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
 * By default build CSS & watch modifications 
 */
gulp.task("default", ["cssApp","cssExternal","watch"]);

/* 
 * Tasks : watch modifications
 */
gulp.task("watch", function() {
    gulp.watch([config.ressource + "/Css/App/**/*.css" ], ["cssApp"]);
});

/* 
 * Tasks : Build CSS of the App
 */
gulp.task("cssApp", function() {
  gulp.src([config.ressource + "/Css/App/**/*.css" ], { cwd: process.cwd() })
  .pipe(plumber())
  .pipe(postcss([
        
        // Check if rules are supported by browser
        doiuse({
            browsers: config.supportedBrowsers,
            ignore: ["css-mediaqueries"]
        }),

        // Check coding style        
        stylelint(
            {"extends": "./.stylelintrc"}
        ),

        // Transform CSS like SASS        
        precss(),

        // Flag warning        
        reporter({ clearMessages: true })
    ]))
  .pipe(sourceMaps.init())
  .pipe(concat("project.app.css"))
  
  // In dev write the sourceMaps
  .pipe(minifyCSS())
  .pipe(isDev ? sourceMaps.write() : util.noop())
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
  .pipe(isDev ? sourceMaps.write() : util.noop())
  .pipe(gulp.dest(config.destination))
});
