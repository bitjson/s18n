'use strict';

var assert = require('assert');
var s18n = require('../');

describe('s18n()', function() {

  it('should be a method', function() {
    assert.equal(typeof s18n, 'function');
  });

  it('should be called', function() {
    s18n();
  });

});
