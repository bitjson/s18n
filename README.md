[![npm version](https://badge.fury.io/js/s18n.svg)](https://www.npmjs.com/package/s18n) [![Build Status](https://travis-ci.org/bitjson/s18n.svg)](https://travis-ci.org/bitjson/s18n) [![Coverage Status](https://coveralls.io/repos/bitjson/s18n/badge.svg)](https://coveralls.io/r/bitjson/s18n) [![Dependency Status](https://david-dm.org/bitjson/s18n.svg)](https://david-dm.org/bitjson/s18n)

s18n (WIP)
==========

**Semantic localization for html.**

S18n parses html elements and attributes to extract text for translation. The automatically generated locale file can then be translated into multiple languages and used by s18n to localize the website or application.

### s18n vs. i18n

S18n provides a simpler, automated alternative to traditional `i18n` (internationalization) libraries, in that it doesn't require outfitting application templates and content with underscore (`_()`) and other i18n functions.

This can be particularly powerful for static generated sites and applications.

### Semantic Localization Example

Given the following `original.html` file:

```html
<h1>foo</h1>
<img alt="bar">
<foo s18n>baz</foo>
```

Using the CLI's extract command in the same directory (with default element, attribute, and directive options):

```bash
$ s18n extract > 'en.json'
```

The following `locale` is saved to `en.json`:

```json
{
  "37b51d19": "bar",
  "73feffa4": "baz",
  "acbd18db": "foo"
}
```

This locale can be translated – or for testing, s18n mapped to a simulated locale:

```bash
$ s18n map 'en.json' -c 'fr' --dictionary 'accents'
```

Producing `fr.json`:

```json
{
  "37b51d19": "bár",
  "73feffa4": "báz",
  "acbd18db": "fóó"
}
```

This can then be used to test localization for the original file:

```bash
$ s18n 'original.html' -l 'fr.json' > 'translated.html'
```

```html
<h1>fóó</h1>
<img alt="bár">
<foo s18n>báz</foo>
```

### Usage

-	[gulp plugin](https://github.com/bitjson/gulp-s18n)
-	command-line interface

CLI
---

To access the CLI system-wide, s18n can be installed globally using [npm](https://docs.npmjs.com/getting-started/installing-node):

```bash
$ npm install -g s18n
```

For CLI usage information:

```bash
$ s18n --help
$ s18n extract --help
$ s18n map --help
```

Node API
--------

```bash
$ npm install s18n
```

### Extract

```js
var s18n = require('s18n');

var html = '<title>foo</title>' +
           '<img alt="bar">' +
           '<foo s18n>baz</foo>';

var locale = s18n.extract(html, {
    elements: ['title'],
    attributes: ['alt'],
    directives: ['s18n'],
});

// locale =>
{
  "acbd18db": "foo",
  "37b51d19": "bar",
  "73feffa4": "baz"
}
```

### Localize

```js
var s18n = require('s18n');

var html = '<title>foo</title>' +
           '<img alt="bar">' +
           '<foo s18n>baz</foo>';

var options = {
  nativeLocale: s18n.extract(html);
  locales: {
    'ac': {
      "acbd18db": "fóó",
      "37b51d19": "bár",
      "73feffa4": "báz"
    }
  }
};

var content = s18n(html, options);

// content =>
{
  'ac' : '<title>fóó</title><img alt="bár"><foo s18n>báz</foo>'
}

```

Testing Localization
--------------------

### Map

```js
var s18n = require('s18n');

var locale = {
  "acbd18db": "foo",
  "37b51d19": "bar"
}

var test = s18n.map(locale, { dictionary: 'accents' });

// test =>
{
  "acbd18db": "fóó",
  "37b51d19": "bár"
}

```

Options
-------

### s18n(html, [options])

### s18n.extract(html, [options])

### s18n.extractFiles(glob, [options,] callback)

#### callback(error, locale)

### s18n.compareLocales(localeA, localeB, [options])

### s18n.formatLocale(locale, [options])

#### options

##### output *(string)*

Options: `string`, `object`

Default: `object`

### s18n.map(locale, options)

Contributing
============

The default Gulp task watches all files and runs tests and code coverage.

```bash
$ npm install -g gulp
$ gulp
```

Testing
-------

This module strives to maintain passing tests with 100% coverage in every commit, and tests are run pre-commit. If you prefer, you can always skip this check with `git commit --no-verify` and squash WIP commits for pull requests later.

If you're unsure or would like help writing tests or getting to 100% coverage, please don't hesitate to open up a pull request so others can help!

Thanks
------

Thanks to [Stephen Pair](https://github.com/gasteve) of [bitpay/translations](https://github.com/bitpay/translations) for some of the architectural inspiration behind s18n. This module builds on the idea of using truncated hashes as identifiers for translatable strings, rather than manually developed indexes.
