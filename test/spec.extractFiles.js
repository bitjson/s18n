'use strict';

var assert = require('assert');
var s18n = require('../');
var fixtures = {
  a: 'test/fixtures/a.html'
};

describe('s18n.extractFiles()', function() {

  it('should be a method', function() {
    assert.notEqual(typeof s18n, 'undefined');
    assert.equal(typeof s18n.extract, 'function');
  });

  it('should extract locale strings from a file', function(cb) {
    s18n.extractFiles(fixtures.a, function(err, locale){
      if(err){
        console.error(err);
      }
      assert.deepEqual(locale, {
        '37b51d19': 'bar',
        '73feffa4': 'baz',
        'acbd18db': 'foo'
      });
      cb();
    });
  });

  it('should return an alphabetically sorted locale object', function(cb) {
    s18n.extractFiles(fixtures.a, function(err, locale){
      if(err){
        console.error(err);
      }
      var count = 0;
      var ordered = ['bar', 'baz', 'foo'];
      for(var number in locale){
        assert.equal(locale[number], ordered[count]);
        count++;
      }
      cb();
    });
  });

});
