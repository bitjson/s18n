'use strict';

var assert = require('assert');
var s18n = require('../');

describe('s18n.extractFiles()', function() {

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
      stringify: true
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
    for(var number in formatedLocale){
      assert.equal(formatedLocale[number], ordered[count]);
      count++;
    }
  });

});
