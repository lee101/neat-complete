var gulp = require('gulp'),
    preprocess = require('gulp-preprocess'),
    coffee = require('gulp-coffee'),
    gutil = require('gulp-util'),
    rename = require('gulp-rename'),
    uglify = require('gulp-uglify'),
    sass = require('gulp-sass'),
    qunit = require('gulp-qunit'),
    connect = require('gulp-connect'),
    header = require('gulp-header');

var pkg = require('./package.json');
var banner = ['/** Neat Complete v<%= pkg.version %>',
              ' * (c) <%= new Date().getFullYear() %> <%= pkg.author %>',
              ' * <%= pkg.license %>',
              ' */\n'].join('\n')

/* Main coffescript build task. Combines coffeescript files, compiles them, then
uglifies the compiled file  */
gulp.task('coffee', function(){
  gulp.src('./src/coffee/core.coffee')
    .pipe(preprocess())
    .pipe(coffee().on('error', gutil.log))
    .pipe(rename('neat_complete.js'))
    .pipe(header(banner,{pkg: pkg}))
    .pipe(gulp.dest('./lib/'))
    .pipe(uglify())
    .pipe(header(banner,{pkg: pkg}))
    .pipe(rename('neat_complete.min.js'))
    .pipe(gulp.dest('./lib/'));
});

/* Compile scss to css */
gulp.task('scss', function(){
  gulp.src('./src/scss/style.scss')
    .pipe(sass())
    .pipe(rename('neat_complete.css'))
    .pipe(gulp.dest('./lib/'))
});

/* Runs qunit tests */
gulp.task('test', function(){
  gulp.src('./test/index.html')
    .pipe(qunit())
});

/* Watches for changes to recompile coffeescript and run tests */
gulp.task('watch', function(){
  gulp.watch('./src/coffee/*.coffee', ['coffee', 'test']);
  gulp.watch('./src/scss/*.scss', ['scss']);
});

/* Creates a server for development */
gulp.task('connect', function(){
  connect.server({port: 8000});
});

gulp.task('default', ['coffee', 'scss', 'test']);
gulp.task('serve', ['connect', 'watch']);
