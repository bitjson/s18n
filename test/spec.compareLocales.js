'use strict';

var assert = require('assert');
var s18n = require('../');

describe('s18n.compareLocales()', function() {

  it('should be a method', function() {
    assert.notEqual(typeof s18n, 'undefined');
    assert.equal(typeof s18n.compareLocales, 'function');
  });

  it('should error if either locale is not an object', function() {
    var localeA = 'a string';
    var localeB = {
      '37b51d19': 'bar',
      'acbd18db': 'fóó',
      '149603e6': 'óld'
    };
    assert.throws(
      function() {
        s18n.compareLocales(localeA, localeB);
      },
      /`localeA`/,
      'unexpected error message');
  });

  it('should return a locale comparison array', function() {
    var localeA = {
      '37b51d19': 'bar',
      '73feffa4': 'baz',
      'acbd18db': 'foo'
    };
    var localeB = {
      '37b51d19': 'bar',
      'acbd18db': 'fóó',
      '149603e6': 'óld'
    };
    var comparisonArray = s18n.compareLocales(localeA, localeB);
    assert.deepEqual(comparisonArray, [
      //0: hashes missing from localeA (present in localeB)
      [{
        hash: '149603e6',
        string: 'óld'
      }],
      //1: hashes missing from localeB (present in localeA)
      [{
        hash: '73feffa4',
        string: 'baz'
      }],
      //2: hashes with duplicate strings (likely untranslated)
      [{
        hash: '37b51d19',
        string: 'bar'
      }],
      //3: hashes with modified strings
      [{
        hash: 'acbd18db',
        strings: [
          'foo',
          'fóó'
        ]
      }]
    ]);
  });

});
