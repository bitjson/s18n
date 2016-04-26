'use strict';

var exec = require('child_process').exec;
var assert = require('assert');
var del = require('del');
var fs = require('fs');
var cli = function(args) {
  var append = args ? ' ' + args : '';
  return 'cd test/fixtures/sample && node ../../../bin/s18n' + append;
};

describe('CLI: \'s18n localize\'', function() {

  it('should localize without args (using defaults)', function(done) {
    del.sync(['test/fixtures/sample/accents/**']);
    exec(cli('localize'), function(err, out, stderr) {
      var localized = String(fs.readFileSync('test/fixtures/sample/accents/page.html'));
      var expected = '<html>\n  <head>\n    <title>My Págé</title>\n  </head>\n' +
      '  <body>\n    <h1>Thís ís á héádíng.</h1>\n    <p>Thís ís á párágráph.</p>\n' +
      '    <img alt=\"Héré\'s thé ált fór thé ímágé\" src=\"nope.png\">\n' +
      '    <foo s18n>Héré\'s á cústóm élémént wíth thé lócálízé díréctívé.</foo>\n  </body>\n</html>\n';
      assert.equal(expected, localized);
      done();
    });
  });

});
