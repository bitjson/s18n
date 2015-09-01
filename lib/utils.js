'use strict';

module.exports = {
  escapeRegExpSpecialChars: function(string) {
    return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, '\\$1');
  }
};
