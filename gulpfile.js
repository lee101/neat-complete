var gulp = require('gulp'),
    preprocess = require('gulp-preprocess'),
    coffee = require('gulp-coffee'),
    gutil = require('gulp-util'),
    rename = require('gulp-rename'),
    uglify = require('gulp-uglify'),
    sass = require('gulp-sass'),
    qunit = require('gulp-qunit');


gulp.task('coffee', function(){
  gulp.src('./src/coffee/core.coffee')
    .pipe(preprocess())
    .pipe(coffee().on('error', gutil.log))
    .pipe(rename('neat_complete.js'))
    .pipe(gulp.dest('./lib/'))
    .pipe(uglify())
    .pipe(rename('neat_complete.min.js'))
    .pipe(gulp.dest('./lib/'));
});

gulp.task('scss', function(){
  gulp.src('./src/scss/style.scss')
    .pipe(sass())
    .pipe(rename('neat_complete.css'))
    .pipe(gulp.dest('./lib/'))
});

gulp.task('test', function(){
  gulp.src('./test/index.html')
    .pipe(qunit())
});

gulp.task('watch', function(){
  gulp.watch('./src/coffee/*.coffee', ['coffee', 'test']);
  gulp.watch('./src/scss/*.scss', ['scss'])
});

gulp.task('default', ['coffee', 'scss', 'test']);
