'use strict';

var assert = require('assert');
var s18n = require('../');

describe('s18n', function() {

  describe('.extract()', function() {

    it('should have an "extract" method', function() {
      assert.equal(typeof s18n, 'object');
      assert.equal(typeof s18n.extract, 'function');
    });

    it('should extract locale strings from configured html attributes', function() {
      var html = '<img src="example.gif" data-custom="custom attribute">';
      var locale = s18n.extract(html, {
        attributes: ['data-custom']
      });
      assert.deepEqual(JSON.parse(locale), {
        '89f8af89':'custom attribute'
      });
    });

    it('should extract locale strings from configured html elements', function() {
      var html = '<h1>heading</h1><custom>Custom element</custom>';
      var locale = s18n.extract(html, {
        elements: ['custom']
      });
      assert.deepEqual(JSON.parse(locale), {
        '74251aeb':'Custom element'
      });
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
