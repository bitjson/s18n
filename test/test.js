'use strict';

var assert = require('assert');
var s18n = require('../');

describe('s18n', function() {

  describe('.extract()', function() {

    it('should have an "extract" method', function() {
      assert.equal(typeof s18n, 'object');
      assert.equal(typeof s18n.extract, 'function');
    });

  });

  describe('.localize()', function() {

    it('should have a "localize" method', function() {
      assert.equal(typeof s18n, 'object');
      assert.equal(typeof s18n.extract, 'function');
    });

  });

  describe('.map()', function() {

    it('should have a "map" method', function() {
      assert.equal(typeof s18n, 'object');
      assert.equal(typeof s18n.extract, 'function');
    });

  });
});
