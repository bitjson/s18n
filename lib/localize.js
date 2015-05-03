'use strict';

module.exports = function(html, options) {
  if (!options.nativeLocale) {
    throw new Error('s18n: missing required option `nativeLocale`.');
  }
  if (!options.locales && !options.locale) {
    throw new Error('s18n: missing required option `locale` or `locales`.');
  }
  if (options.locales && options.locale) {
    throw new Error('s18n: both `locale` and `locales` options are defined.');
  }

  // strings must be exactly between delimiters in this set to be localized
  // (this avoids unintentional localization of unrelated strings)
  var delimiters = [
    ['>', '<'],
    ['"', '"'],
    ['\'', '\'']
  ];

  var localizations = {};
  if (options.locale) {
    options.locales = {};
    options.locales.tmp = options.locale;
  }
  for (var id in options.locales) {
    localizations[id] = html;
    for (var hash in options.nativeLocale) {
      for (var i = 0; i < delimiters.length; i++) {
        var chunks = localizations[id].split(
          delimiters[i][0] +
          options.nativeLocale[hash] +
          delimiters[i][1]);

        localizations[id] = chunks.join(
          delimiters[i][0] +
          options.locales[id][hash] +
          delimiters[i][1]);
      }
    }
  }
  if(options.locale){
    localizations = localizations.tmp;
  }
  return localizations;
};
