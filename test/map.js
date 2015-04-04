'use strict';

var assert = require('assert');
var s18n = require('../');

describe('s18n.map()', function() {

  it('should have a "map" method', function() {
    assert.equal(typeof s18n, 'object');
    assert.equal(typeof s18n.extract, 'function');
  });

});
