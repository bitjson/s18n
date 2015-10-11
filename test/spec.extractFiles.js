'use strict';

var assert = require('assert');
var sinon = require('sinon');
var s18n = require('../');

var fixtures = {
  a: 'test/fixtures/a.html',
  b: 'test/fixtures/{a,b}.html'
};

describe('s18n.extractFiles()', function() {

  it('should be a method', function() {
    assert.notEqual(typeof s18n, 'undefined');
    assert.equal(typeof s18n.extract, 'function');
  });

  it('should extract locale strings from a file', function() {
    return s18n.extractFiles(fixtures.a).then(function(locale) {
      assert.deepEqual(locale, {
        '37b51d19': 'bar',
        '73feffa4': 'baz',
        'acbd18db': 'foo'
      });
    });
  });

  it('should extract locale strings from multiple files', function() {
    return s18n.extractFiles(fixtures.b).then(function(locale) {
      console.log('made2');
      assert.deepEqual(locale, {
        '37b51d19': 'bar',
        '224e2539': 'bar2',
        '73feffa4': 'baz',
        '91f372a2': 'baz2',
        'acbd18db': 'foo',
        '92e00571': 'foo2'
      });
    });
  });

  it('should accept globbyOpts', function() {
    return s18n.extractFiles(fixtures.a, {
      globbyOpts: {
        dot: true
      }
    });
  });

  it('should return an alphabetically sorted locale object', function() {
    return s18n.extractFiles(fixtures.a).then(function(locale) {
      var count = 0;
      var ordered = ['bar', 'baz', 'foo'];
      for (var number in locale) {
        assert.equal(locale[number], ordered[count]);
        count++;
      }
    });
  });

  it('should return fs errors properly', function() {
    var stub = sinon.stub(require('fs'), 'readFile').callsArgWith(1, 'mock fs error');
    return s18n.extractFiles(fixtures.a).catch(function(err) {
      assert.equal(err, 'mock fs error');
      stub.restore();
    });
  });

});
