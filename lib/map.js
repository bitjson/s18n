'use strict';

module.exports = function(locale, options) {
  var regexs = {};
  for (var findString in options.dictionary) {
    //don't replace characters inside html tags (between `<` and `>`)
    regexs[options.dictionary[findString]] = new RegExp('(?![^<]*>)' + escapeRegExp(findString), 'g');
  }
  for (var hash in locale) {
    for (var replacement in regexs) {
      locale[hash] = locale[hash].replace(regexs[replacement], replacement);
    }
  }
  return locale;
};

function escapeRegExp(string) {
  return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, '\\$1');
}
