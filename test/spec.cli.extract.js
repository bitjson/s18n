'use strict';

var exec = require('child_process').exec;
var assert = require('assert');
var cli = require('./cli');

describe('CLI: \'s18n extract\'', function() {

  it('should extract from fixtures using defaults', function(done) {
    exec(cli('extract -p \'["**/*.html", "!*/sample/**/*.html"]\''), function(err, out, stderr) {
      var expected = '{\n  \"37b51d19\": \"bar\",\n  \"224e2539\": \"bar2\",\n  \"73feffa4\": \"baz\",\n  ' +
        '\"91f372a2\": \"baz2\",\n  \"acbd18db\": \"foo\",\n  \"92e00571\": \"foo2\"\n}\n';
      assert.equal(expected, out);
      done();
    });
  });

  it('should \'$ s18n extract -s "<p>Hello, World!</p>"\'', function(done) {
    exec(cli('extract -s "<p>Hello, World!</p>"'), function(err, out, stderr) {
      assert.equal('{\n  \"65a8e27d\": \"Hello, World!\"\n}\n', out);
      done();
    });
  });

  it('should \'$ s18n extract -p \'["**/*.html", "!**/b.html", "!*/sample/**/*.html"]\'', function(done) {
    exec(cli('extract -p \'["**/*.html", "!**/b.html", "!*/sample/**/*.html"]\''), function(err, out, stderr) {
      assert.equal('{\n  \"37b51d19\": \"bar\",\n  \"73feffa4\": \"baz\",\n  \"acbd18db\": \"foo\"\n}\n', out);
      done();
    });
  });

  it('should \'$ s18n extract -a . -e . -d s18n\'', function(done) {
    exec(cli('extract -a . -e . -d s18n -p \'["**/*.html", "!*/sample/**/*.html"]\''), function(err, out, stderr) {
      assert.equal('{\n  \"37b51d19\": \"bar\",\n  \"224e2539\": \"bar2\"\n}\n', out);
      done();
    });
  });

});
