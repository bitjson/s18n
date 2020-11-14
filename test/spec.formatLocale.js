'use strict';

var assert = require('assert');
var s18n = require('../');

describe('s18n.formatLocale()', function() {

  it('should be a method', function() {
    assert.notEqual(typeof s18n, 'undefined');
    assert.equal(typeof s18n.formatLocale, 'function');
  });

  it('should sort and return a locale as a string', function() {
    var locale = {
      'acbd18db': 'foo',
      '37b51d19': 'bar',
      '73feffa4': 'baz'
    };
    var formatedLocale = s18n.formatLocale(locale, {
      output: 'string'
    });
    assert.equal(formatedLocale, '{\n  "37b51d19": "bar",\n  "73feffa4": "baz",\n  "acbd18db": "foo"\n}');
  });

  it('should sort and return a locale as an object', function() {
    var locale = {
      'acbd18db': 'foo',
      'badhash': 'foo',
      '37b51d19': 'bar',
      '73feffa4': 'baz'
    };
    var formatedLocale = s18n.formatLocale(locale);
    var count = 0;
    var ordered = ['bar', 'baz', 'foo', 'foo'];
    for (var number in formatedLocale) {
      assert.equal(formatedLocale[number], ordered[count]);
      count++;
    }
  });

  it('should return and unsorted locale as a string', function() {
    var locale = {
      'acbd18db': 'foo',
      '37b51d19': 'bar',
      '73feffa4': 'baz'
    };
    var formatedLocale = s18n.formatLocale(locale, {
      output: 'string',
      sort: false
    });
    assert.equal(formatedLocale, '{\n  "acbd18db": "foo",\n  "37b51d19": "bar",\n  "73feffa4": "baz"\n}');
  });

  it('should return an unsorted locale as an object', function() {
    var locale = {
      'acbd18db': 'foo',
      'badhash': 'foo',
      '37b51d19': 'bar',
      '73feffa4': 'baz'
    };
    var formatedLocale = s18n.formatLocale(locale, {sort: false});
    var count = 0;
    var ordered = ['foo', 'foo', 'bar', 'baz'];
    for (var number in formatedLocale) {
      assert.equal(formatedLocale[number], ordered[count]);
      count++;
    }
  });

  it('should throw an error if output option is unrecognized', function() {
    assert.throws(
      function() {
        s18n.formatLocale({}, {
          output: 'futureFormat'
        });
      },
      /`output`/,
      'unexpected error message');
  });

});
