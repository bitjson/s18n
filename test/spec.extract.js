'use strict';

var assert = require('assert');
var s18n = require('../');

describe('s18n.extract()', function() {

  it('should be a method', function() {
    assert.notStrictEqual(typeof s18n, 'undefined');
    assert.equal(typeof s18n.extract, 'function');
  });

  it('should extract locale strings from configured html attributes', function() {
    var html = '<img src="example.gif" data-custom="custom attribute">';
    var locale = s18n.extract(html, {
      attributes: ['data-custom']
    });
    assert.deepEqual(locale, {
      '89f8af89': 'custom attribute'
    });
  });

  it('should extract locale strings from configured html elements', function() {
    var html = '<h1>heading</h1><custom>Custom element</custom>';
    var locale = s18n.extract(html, {
      elements: ['custom']
    });
    assert.deepEqual(locale, {
      '74251aeb': 'Custom element'
    });
  });

  it('should extract locale strings from html elements with configured directives', function() {
    var html = '<div translate="yes">This is a test.</div><div custom>custom directive</div>';
    var locale = s18n.extract(html, {
      directives: ['translate=yes', 'custom']
    });
    assert.deepEqual(locale, {
      '120ea8a2': 'This is a test.',
      '6bd3b8ac': 'custom directive'
    });
  });

  it('should not extract locale strings from html elements with configured cancelers', function() {
    var html = '<p>Translate.</p><p translate="no">Do not translate.</p>';
    var locale = s18n.extract(html, {
      elements: ['p'],
      cancelers: ['translate=no']
    });
    assert.deepEqual(locale, {
      '0e7c5573': 'Translate.'
    });
  });

  it('should allow other hash algorithms', function() {
    var html = '<p>This is a test.</p>';
    var locale = s18n.extract(html, {
      hashAlgorithm: 'rmd160'
    });
    assert.deepEqual(locale, {
      '3c82f755': 'This is a test.'
    });
  });

  it('should allow for different hash lengths', function() {
    var html = '<p>This is a test.</p>';
    var locale = s18n.extract(html, {
      hashLength: 13
    });
    assert.deepEqual(locale, {
      '120ea8a25e5d4': 'This is a test.'
    });
  });

  it('should return an alphabetically sorted locale object', function() {
    var html = '<p>String A</p><p>String C</p><p>String B</p>';
    var locale = s18n.extract(html);
    var count = 0;
    var ordered = ['String A', 'String B', 'String C'];
    for(var number in locale){
      assert.equal(locale[number], ordered[count]);
      count++;
    }
  });

});
