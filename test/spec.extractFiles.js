'use strict';

var assert = require('assert');
var proxyquire = require('proxyquire');
var sinon = require('sinon');
var s18n = require('../');

var fixtures = {
  a: 'test/fixtures/a.html'
};

describe('s18n.extractFiles()', function() {

  it('should be a method', function() {
    assert.notEqual(typeof s18n, 'undefined');
    assert.equal(typeof s18n.extract, 'function');
  });

  it('should extract locale strings from a file', function(done) {
    s18n.extractFiles(fixtures.a, function(err, locale) {
      assert.deepEqual(locale, {
        '37b51d19': 'bar',
        '73feffa4': 'baz',
        'acbd18db': 'foo'
      });
      done();
    });
  });

  it('should accept globbyOpts', function(done) {
    s18n.extractFiles(fixtures.a, {
      globbyOpts: {
        dot: true
      }
    }, function(err, locale) {
      assert.ifError(err);
      done();
    });
  });

  it('should return an alphabetically sorted locale object', function(done) {
    s18n.extractFiles(fixtures.a, function(err, locale) {
      var count = 0;
      var ordered = ['bar', 'baz', 'foo'];
      for (var number in locale) {
        assert.equal(locale[number], ordered[count]);
        count++;
      }
      done();
    });
  });

  it('should return globby errors properly', function(done) {
    var mocked = proxyquire('../lib/extractFiles', {
      globby: sinon.stub().callsArgWith(2, 'mock globby error')
    });
    mocked(fixtures.a, function(err, locale) {
      assert.equal(err, 'mock globby error');
      done();
    });
  });

  it('should return fs errors properly', function(done) {
    var stub = sinon.stub(require('fs'), 'readFile').callsArgWith(1, 'mock fs error');
    s18n.extractFiles(fixtures.a, function(err, locale) {
      assert.equal(err, 'mock fs error');
      stub.restore();
      done();
    });
  });

});
