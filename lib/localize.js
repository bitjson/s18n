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

  // avoids unintentional localization of unrelated strings
  function softReplace(document, nativeString, localizedString) {
    var regex = new RegExp('([>"\']\\s*)(' + nativeString + ')(\\s*[<"\'])', 'g');
    return document.replace(regex, '$1' + localizedString + '$3');
  }

  var localizations = {};
  if (options.locale) {
    options.locales = {};
    options.locales.tmp = options.locale;
  }
  for (var id in options.locales) {
    localizations[id] = html;
    for (var hash in options.nativeLocale) {
      localizations[id] = softReplace(
        localizations[id],
        options.nativeLocale[hash],
        options.locales[id][hash]);
    }
  }
  if (options.locale) {
    localizations = localizations.tmp;
  }
  return localizations;
};
