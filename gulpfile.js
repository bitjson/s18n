'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var runSequence = require('run-sequence');
var bin = 'bin/*';
var js = '*.js';
var lib = 'lib/**/*.js';
var tests = 'test/**/*.{js, json}';
var developing = false;

gulp.task('default', function(){
  developing = true;
  runSequence(['watch']);
});

gulp.task('watch', ['test'], function(){
  gulp.watch([bin, js, lib, tests], ['test']);
});

gulp.task('test', ['jshint','rm-coverage'], function(cb) {
  gulp.src([bin, lib])
    .pipe($.istanbul())
    .pipe($.istanbul.hookRequire())
    .on('finish', function () {
      gulp.src(['test/*.js'], {read: false})
        .pipe($.mocha())
        .pipe($.istanbul.writeReports())
        .on('end', cb);
    });
});

gulp.task('jshint', function () {
  return gulp.src([bin, js, lib, tests])
    .pipe($.jshint())
    .pipe($.jshint.reporter('jshint-stylish'))
    .pipe($.if(!developing, $.jshint.reporter('fail')));
});

gulp.task('coveralls', function () {
  return gulp.src('coverage/lcov.info')
    .pipe($.coveralls());
});

gulp.task('rm-coverage', function (cb) {
    (require('rimraf'))('coverage', cb);
});
