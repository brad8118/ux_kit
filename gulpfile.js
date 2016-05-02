var gulp = require('gulp');
//var sass = require('gulp-sass'),
var less = require('gulp-less');
var path = require('path');
var livereload = require('gulp-livereload');
var concat = require('gulp-concat');
var sourcemaps = require('gulp-sourcemaps');
var async = require('async');
var gutil = require("gulp-util");
var packageJson = require("./package.json");
var header = require("gulp-header");
var svgSprite = require('gulp-svg-sprite');
var del = require('del');

//https://github.com/jonathantneal/postcss-write-svg

//---------------------------------------------------------
//--------------------- Private Variables  ----------------
//---------------------------------------------------------

var spriteOut = './svg/out/';

//---------------------------------------------------------
//--------------------- Private Helpers  ------------------
//---------------------------------------------------------

function onError(err, taskName) {
    gutil.log(gutil.colors.red("ERROR", "Theres an error"), err);
    this.emit("end", new gutil.PluginError("Theres an error", err, { showStack: true }));
};

//---------------------------------------------------------
//--------------------- Tasks -----------------------------
//---------------------------------------------------------

//******************
// complie less
gulp.task('less', function (cb) {
    var lessOptions = { paths: [path.join(__dirname, 'less', "teams")] };
    return gulp.src(['./less/teams/*.less'])
        .pipe(less(lessOptions).on('error', onError)) // prevents watch from hanging
        .pipe(gulp.dest('./less/out'));
    //.on('end', cb);
})

//********************************
// generate sprite sheet from svgs
gulp.task('sprite', function (cb) {

    return async.series([
        function (callback) {
            //clean up the out folder first
            // del([spriteOut]).then(paths => {
            //     gutil.log(gutil.colors.yellow('SVG out folder deleted'));
            // });

            callback();
        },
        function (callback) {
            //http://jkphl.github.io/svg-sprite/#gulp
            var config = {
                "shape": {
                    "dimension": {
                        "attributes": true
                    }
                },
                "mode": {
                    "css": {
                        "dimensions": true,
                        "example": true,
                        "bust": false,
                        "render": {
                            "css": true,
                            "less": true
                        }
                    }
                }
            }

            //gulp.src('**/*.svg', { cwd: './svg/common' })
            gulp.src(['./svg/common/*.svg', './svg/te/*.svg'])
                .pipe(svgSprite(config))
                .pipe(gulp.dest(spriteOut + "/te"))
                .on('end', callback);
        },
        function (callback) {
            var filesToMove = [spriteOut + 'css/sprite.css', spriteOut + 'css/sprite.css.html', spriteOut + 'css/svg/**/*'];

            // gulp.src(filesToMove, { base: spriteOut })
            //     .pipe(gulp.dest('./public/'))
            //     .on('end', callback);

            // gutil.log(gutil.colors.yellow('Sprites moved to public folder'));
        }
    ],
        function (err, result) {
            if (err) {
                onError(err);
                cb('Yikes theres an error, silly');
            } else {
                cb();
            }
        });
});

//gulp.task('default', ['less', 'serve', 'sprite', 'watch'], function(cb) {});