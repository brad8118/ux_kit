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



function moveFilesToPublic() {
    gulp.src('./bootstrap/js/*.js')
        .pipe(gulp.dest('./public'));
}

function onError(err, taskName) {
    gutil.log(gutil.colors.red("ERROR", "Theres an error"), err);
    this.emit("end", new gutil.PluginError("Theres an error", err, { showStack: true }));
};

//to start the browser on port 4000
gulp.task('moveFiles', function() {
    moveFilesToPublic();
})

//to start the browser on port 4000
gulp.task('lessFont', function(cb) {
    var lessOptions = { paths: [path.join(__dirname, 'fonts')] };
    return gulp.src('./fonts/**/*.less')
        .pipe(less(lessOptions).on('error', onError)) // prevents watch from hanging
        .pipe(gulp.dest('./fonts/'));
        //.on('end', cb);
})

//complie bootstrap
gulp.task('boot_less', function(cb) {
    var lessOptions = { paths: [path.join(__dirname, 'less', "teams")] };
    return gulp.src(['./less/teams/*.less'])
        .pipe(less(lessOptions).on('error', onError)) // prevents watch from hanging
        .pipe(gulp.dest('./less/out'));
        //.on('end', cb);
})

//the less files to compile to CSS
gulp.task('less', function(cb) {

    return async.series([
            function(callback) {
                //generate css files from less
                var lessOptions = { paths: [path.join(__dirname, 'less', 'includes')] };
                gulp.src('./less/**/*.less')
                    .pipe(less(lessOptions).on('error', onError)) // prevents watch from hanging
                    .pipe(gulp.dest('./css/'))
                    .on('end', callback);
            },
            function(callback) {
                //combine css into a single css file
                gulp.src(['./bootstrap/css/bootstrap.css', './bootstrap/css/bootstrap-theme.css', './css/ux_common.css'])
                    .pipe(sourcemaps.init())
                    .pipe(concat('ux_combined.css', { newLine: '\r\n' }))
                    .pipe(sourcemaps.write('./maps'))
                    .pipe(gulp.dest('./css/'))
                    .on('end', callback);
            },
            function(callback) {
                //append indo to css files
                gulp.src(['./css/ux_combined.css', './css/ux_website.css'])
                    .pipe(header(packageJson.css_description))
                    .pipe(header("\r\n /*! version: " + packageJson.version + " Date: " + Date() + " */\r\n"))
                    .pipe(gulp.dest('./css/'))
                    .on('end', callback);
            },
            function(callback) {
                var filesToMove = ['./css/ux_combined.css', './css/ux_website.css', './css/maps/*'];

                gulp.src(filesToMove)
                    .pipe(gulp.dest('./public/css/'))
                    .pipe(livereload())
                    .on('end', callback);
            }
        ],
        function(err, result) {
            if (err) {
                onError(err);
                cb('Yikes theres an error, silly');
            } else {
                cb();
            }
        });

});

//generate sprite sheet from svgs
gulp.task('sprite', function(cb) {

    var out = './svgs/out2/';
    return async.series([
            function(callback) {
                //clean up the out folder first
                del([out]).then(paths => {
                    gutil.log(gutil.colors.yellow('SVG out folder deleted'));
                });

                callback();
            },
            function(callback) {
                //Generate the sprite css & svg from all svgs
                //TODO: Need to change to generate by team.
                //http://jkphl.github.io/svg-sprite/#gulp
                var config = {
                    "shape": {
                        "dimension": {
                            "maxWidth": 32,
                            "maxHeight": 32,
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

                gulp.src('**/*.svg', { cwd: './svgs/common' })
                    .pipe(svgSprite(config))
                    .pipe(gulp.dest(out))
                    .on('end', callback);
            },
            function(callback) {
                var filesToMove = ['./svgs/out2/css/sprite.css', './svgs/out2/css/sprite.css.html', './svgs/out2/css/svg/**/*'];

                gulp.src(filesToMove, { base: './svgs/out2' })
                    .pipe(gulp.dest('./public/'))
                    .on('end', callback);

                gutil.log(gutil.colors.yellow('Sprites moved to public folder'));
            }
        ],
        function(err, result) {
            if (err) {
                onError(err);
                cb('Yikes theres an error, silly');
            } else {
                cb();
            }
        });
});

//to start the browser on port 4000
gulp.task('serve', function() {
    var express = require('express');
    var app = express();
    app.use(express.static(__dirname));
    app.listen(4000, '0.0.0.0');

    //http://localhost:4000/public/
});

//when less files are saved the CSS files are generated automaticly
gulp.task('watch', function() {
    gulp.watch('./less/**/*.less', ['less']);
    gulp.watch('./svgs/common/*.svg', ['sprite']);
    livereload.listen();
});


gulp.task('build', ['less', 'sprite'], function(cb) {});

gulp.task('default', ['less', 'serve', 'sprite', 'watch'], function(cb) {});