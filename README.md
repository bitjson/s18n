[![npm version](https://badge.fury.io/js/s18n.svg)](https://www.npmjs.com/package/s18n) [![Build Status](https://travis-ci.org/bitjson/s18n.svg)](https://travis-ci.org/bitjson/s18n) [![Coverage Status](https://coveralls.io/repos/bitjson/s18n/badge.svg)](https://coveralls.io/r/bitjson/s18n) [![Dependency Status](https://david-dm.org/bitjson/s18n.svg)](https://david-dm.org/bitjson/s18n)

s18n (WIP)
==========

Smart, semantic localization for html.

### Semantic Localization

```html
<html>
  <head>
    <title>foo</title>
  </head>
  <body>
    <h1>bar</h1>
    <img alt="baz">
    <foo s18n>bar</foo>
  </body>
</html>
```

```bash
$ s18n extract
```

```json
{
  "acbd18db": "foo",
  "37b51d19": "bar",
  "73feffa4": "baz"
}
```

### s18n vs i18n

### Usage

-	gulp
-	command-line

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

### s18n(html, options)

### s18n.extract(html, options)

### s18n.extractFiles(glob, [options,] callback)

#### callback(error, locale)

### s18n.formatLocale(glob, [options,] callback)

#### options

##### stringify *(boolean)*

### s18n.map(locale, options)
