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

  it('should replace substrings properly', function() {
    var locale = {
      'hash': 'testing one two three.'
    };
    var mappedLocale = s18n.map(locale, {
      dictionary: {
        'r': 'rr',
        'rr': 'rrr',
        'a': 'V',
        'e': 'V',
        'i': 'V',
        'two': 'zwei'
      }
    });
    assert.deepEqual(mappedLocale, {
      'hash': 'tVstVng onV zwei thrrrVV.'
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

  it('should not replace characters within html tags', function() {
    var locale = {
      '553b0eb0': 'This is <a href="example.com" title="notranslate">a test</a>.'
    };
    var mappedLocale = s18n.map(locale, {
      dictionary: 'accents'
    });
    assert.deepEqual(mappedLocale, {
      '553b0eb0': 'Thís ís <a href="example.com" title="notranslate">á tést</a>.'
    });
  });

  it('should not replace characters within html entites', function() {
    var locale = {
      '59d2e85b': 'Go to the test &rsaquo;'
    };
    var mappedLocale = s18n.map(locale, {
      dictionary: 'accents'
    });
    assert.deepEqual(mappedLocale, {
      '59d2e85b': 'Gó tó thé tést &rsaquo;'
    });
  });

});
