'use strict';

module.exports = function(html, options) {
  if (!options.nativeLocale) {
    throw new Error('s18n: missing required option `nativeLocale`.');
  }
  if (!options.locales) {
    throw new Error('s18n: missing required option `locales`.');
  }

  // strings must be exactly between delimiters in this set to be localized
  // (this avoids unintentional localization of unrelated strings)
  var delimiters = [
    ['>', '<'],
    ['"', '"'],
    ['\'', '\'']
  ];

  var localizations = {};
  for (var loc = 0; loc < options.locales.length; loc++) {
    for (var localeIdentifier in options.locales[loc]) {
      var localizedHtml = html;
      for (var hash in options.nativeLocale) {
        for (var i = 0; i < delimiters.length; i++) {
          var chunks = localizedHtml.split(
            delimiters[i][0] +
            options.nativeLocale[hash] +
            delimiters[i][1]);
          localizedHtml = chunks.join(
            delimiters[i][0] +
            options.locales[loc][localeIdentifier][hash] +
            delimiters[i][1]);
        }
      }
      localizations[localeIdentifier] = localizedHtml;
    }
  }

  return localizations;
};
