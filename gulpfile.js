'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var run = require('run-sequence');
var bin = 'bin/*';
var js = '*.js';
var lib = 'lib/**/*.js';
var tests = 'test/**/*.{js, json}';
var developing = false;

gulp.task('default', ['watch']);

gulp.task('watch', function(){
  developing = true;
  run('test');
  gulp.watch([bin, js, lib, tests], ['test']);
});

gulp.task('test', ['jshint', 'rm-coverage'], function(){
  run('cover-tests', 'enforce-coverage');
});

gulp.task('cover-tests', $.shell.task([
  './node_modules/.bin/istanbul cover ./node_modules/mocha/bin/_mocha --print detail'
]));

gulp.task('jshint', function () {
  return gulp.src([bin, js, lib, tests])
    .pipe($.jshint())
    .pipe($.jshint.reporter('jshint-stylish'))
    .pipe($.if(!developing, $.jshint.reporter('fail')));
});

gulp.task('enforce-coverage', function () {
  var options = {
        thresholds : {
          statements : 100,
          branches : 100,
          lines : 100,
          functions : 100
        },
        coverageDirectory : 'coverage',
        rootDirectory : ''
      };
  return gulp.src('.')
    .pipe($.istanbulEnforcer(options));
});

gulp.task('rm-coverage', function (cb) {
    (require('rimraf'))('coverage', cb);
});
