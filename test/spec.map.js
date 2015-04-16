'use strict';

var assert = require('assert');
var s18n = require('../');

describe('s18n.map()', function() {

  it('should be a method', function() {
    assert.notEqual(typeof s18n, 'undefined');
    assert.equal(typeof s18n.map, 'function');
  });

  it('should replace substrings using a provided dictionary', function() {
    var locale = {
      '3c82f755': 'This is a test.'
    };
    var mappedLocale = s18n.map(locale, {
      dictionary: {
        'Th': 'Z',
        'a': 'á',
        'e': 'é',
        'i': 'í'
      }
    });
    assert.deepEqual(mappedLocale, {
      '3c82f755': 'Zís ís á tést.'
    });
  });

  it('should default to the `accents` dictionary', function() {
    var locale = {
      '3c82f755': 'This is a test.'
    };
    var mappedLocale = s18n.map(locale);
    assert.deepEqual(mappedLocale, {
      '3c82f755': 'Thís ís á tést.'
    });
  });

  it('should accept the `accents` dictionary', function() {
    var locale = {
      '3c82f755': 'This is a test.'
    };
    var mappedLocale = s18n.map(locale, {
      dictionary: 'accents'
    });
    assert.deepEqual(mappedLocale, {
      '3c82f755': 'Thís ís á tést.'
    });
  });

});
