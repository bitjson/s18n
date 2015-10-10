'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var run = require('run-sequence');
var bin = 'bin/*';
var js = '*.js';
var lib = 'lib/**/*.js';
var tests = 'test/**/*.{js, json}';
var developing = false;

gulp.task('default', function(cb) {
  developing = true;
  run('test', 'watch', cb);
});

gulp.task('watch', function() {
  gulp.watch([bin, js, lib, tests], ['test']);
});

gulp.task('test', ['jscs-jshint'], function() {
  run('rm-coverage', 'cover-tests', 'enforce-coverage');
});

gulp.task('cover-tests', $.shell.task([
  './node_modules/.bin/istanbul cover ./node_modules/mocha/bin/_mocha --print detail'
]));

gulp.task('jscs-jshint', function() {
  return gulp.src([bin, js, lib, tests], {
      base: './'
    })
    .pipe($.cached('jscs-jshint'))
    .pipe($.jscs({
      fix: true
    }))
    .pipe($.jscs.reporter())
    .pipe($.if(!developing, $.jscs.reporter('fail')))
    .pipe($.jshint())
    .pipe($.jshint.reporter('jshint-stylish'))
    .pipe($.if(!developing, $.jshint.reporter('fail')))
    .pipe(gulp.dest('.'));
});

gulp.task('enforce-coverage', function() {
  var options = {
    thresholds: {
      statements: 100,
      branches: 100,
      lines: 100,
      functions: 100
    },
    coverageDirectory: 'coverage',
    rootDirectory: ''
  };
  return gulp.src('.')
    .pipe($.istanbulEnforcer(options));
});

gulp.task('rm-coverage', function(cb) {
  require('del')('coverage', function(err) {
    if (err) {
      console.error(err);
    }
    cb();
  });
});
