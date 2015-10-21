// Gulp dependencies
var path = require("path");
var gulp = require("gulp");
var util = require("gulp-util");
var concat = require("gulp-concat");
var sourceMaps = require("gulp-sourcemaps");
var minifyCSS = require("gulp-minify-css");
var postcss = require("gulp-postcss");
var plumber = require("gulp-plumber");

// PostCSS dependencies
var reporter = require("postcss-reporter")
var stylelint = require("stylelint");
var doiuse = require("doiuse");
var precss = require("precss")

// Check environnement
var isDev = !!util.env.dev

// App Config 
var config = {
    sourcePath: "Content",
    sourceType: {
        css: {
            app: "/Css/App/**/*.css",
            external: "/Css/External/**/*.css"
        }
    },
    destinationPath: "./Build",
    supportedBrowsers: [
        "last 2 version",
        "> 5% in ca",
        "ie >= 8"
    ]
};

/* 
 * Tasks: Defaults
 * By default build CSS & watch modifications 
 */
gulp.task("default", ["cssExternal", "cssApp", "watch"]);

/* 
 * Tasks: watch modifications
 */
gulp.task("watch", function () {
    gulp.watch([config.sourcePath + config.sourceType.css.app], ["cssApp"]);
});

/* 
 * Tasks: Build External CSS
 */
gulp.task("cssExternal", function () {
    gulp.src([config.sourcePath + config.sourceType.css.external], { cwd: process.cwd() })
        .pipe(plumber())
        .pipe(sourceMaps.init())
        .pipe(concat("project.external.css"))
        .pipe(minifyCSS())
  
        // In dev write the sourceMaps
        .pipe(isDev ? sourceMaps.write() : util.noop())
        .pipe(gulp.dest(config.destinationPath))
});

/* 
 * Tasks: Build CSS of the App
 */
gulp.task("cssApp", function () {
    gulp.src([config.sourcePath + config.sourceType.css.app], { cwd: process.cwd() })
        .pipe(plumber())
        .pipe(postcss([
        
            // Check if rules are supported by browser
            doiuse({
                browsers: config.supportedBrowsers,
                ignore: ["css-mediaqueries"]
            }),

            // Check coding style        
            stylelint({ "extends": "./.stylelintrc" }),

            // Transform in like SASS way        
            precss(),

            // Flag warning if error    
            reporter({ clearMessages: true })
        ]))
        .pipe(sourceMaps.init())
        .pipe(concat("project.app.css"))
        .pipe(minifyCSS())
  
        // In dev write the sourceMaps
        .pipe(isDev ? sourceMaps.write() : util.noop())
        .pipe(gulp.dest(config.destinationPath))
});
