'use strict';

module.exports = function(args) {
  var append = args ? ' ' + args : '';
  return 'cd test && node ../bin/s18n' + append;
};
