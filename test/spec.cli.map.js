'use strict';

var exec = require('child_process').exec;
var assert = require('assert');
var cli = require('./cli');

describe('CLI: \'s18n map\'', function() {

  it('should map the fixture locale using defaults', function(done) {
    exec(cli('map fixtures/foo.json'), function(err, out, stderr) {
      var expected = '{\n  \"37b51d19\": \"bár\",\n  \"73feffa4\": \"báz\",\n  \"acbd18db\": \"fóó\"\n}\n';
      assert.equal(expected, out);
      done();
    });
  });

});
