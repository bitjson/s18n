'use strict';

var assert = require('assert');
var s18n = require('../');

// var fixtures = {
//   a: 'test/fixtures/a.html'
// };

describe('s18n()', function() {

  it('should be a method', function() {
    assert.equal(typeof s18n, 'function');
  });

  it('should throw an error if nativeLocale option is undefined', function() {
    var html = '<p>This is a test.</p>';
    var accentedLocale = {
      '3c82f755': 'Thís ís á tést.'
    };
    assert.throws(
      function() {
        s18n(html, {
          locales: [{
            'accents': accentedLocale
          }]
        });
      },
      function(err) {
        if ((err instanceof Error) && /`nativeLocale`/.test(err)) {
          return true;
        }
      }, 'unexpected error message');
  });

  it('should throw an error if locales option is undefined', function() {
    var html = '<p>This is a test.</p>';
    var nativeLocale = {
      '3c82f755': 'This is a test.'
    };
    assert.throws(
      function() {
        s18n(html, {
          nativeLocale: nativeLocale
        });
      },
      function(err) {
        if ((err instanceof Error) && /`locales`/.test(err)) {
          return true;
        }
      }, 'unexpected error message');
  });

  it('should localize some html', function() {
    var html = '<p>This is a test.</p>';
    var nativeLocale = {
      '3c82f755': 'This is a test.'
    };
    var accentedLocale = {
      '3c82f755': 'Thís ís á tést.'
    };
    var localizedHtml = s18n(html, {
      nativeLocale: nativeLocale,
      locales: {
        'accents': accentedLocale
      }
    });
    assert.deepEqual(localizedHtml, {
      accents: '<p>Thís ís á tést.</p>'
    });
  });

  it('should localize some html with only one locale', function() {
    var html = '<p>This is a test.</p>';
    var nativeLocale = {
      '3c82f755': 'This is a test.'
    };
    var accentedLocale = {
      '3c82f755': 'Thís ís á tést.'
    };
    var localizedHtml = s18n(html, {
      nativeLocale: nativeLocale,
      locale: accentedLocale
    });
    assert.equal(localizedHtml, '<p>Thís ís á tést.</p>');
  });

  it('should error if both `locale` and `locales` are set', function() {
    var html = '<p>This is a test.</p>';
    var nativeLocale = {
      '3c82f755': 'This is a test.'
    };
    var accentedLocale = {
      '3c82f755': 'Thís ís á tést.'
    };
    assert.throws(
      function() {
        s18n(html, {
          nativeLocale: nativeLocale,
          locale: accentedLocale,
          locales: {
            'de': accentedLocale,
            'wat': accentedLocale
          }
        });
      },
      function(err) {
        if ((err instanceof Error) && /`locale`/.test(err) && /`locales`/.test(err)) {
          return true;
        }
      }, 'unexpected error message');    
  });

  it('should localize strings only in localizable places (/>*</, /"*"/, /\'*\'/)', function() {
    var html = '<test test="test" testattr=\'test\'>test</test>';
    var nativeLocale = {
      '098f6bcd': 'test'
    };
    var accentedLocale = {
      '098f6bcd': 'tést'
    };
    var localizedHtml = s18n(html, {
      nativeLocale: nativeLocale,
      locales: {
        'accents': accentedLocale
      }
    });
    assert.deepEqual(localizedHtml, {
      accents: '<test test="tést" testattr=\'tést\'>tést</test>'
    });
  });

  it('should localize some html with multiple locales', function() {
    var html = '<p>This is a test.</p>';
    var localizedHtml = s18n(html, {
      nativeLocale: {
        '3c82f755': 'This is a test.'
      },
      locales: {
        'accents': {
          '3c82f755': 'Thís ís á tést.'
        },
        'denglish': {
          '3c82f755': 'Zis ist a tesht.'
        }
      }
    });
    assert.deepEqual(localizedHtml, {
      accents: '<p>Thís ís á tést.</p>',
      denglish: '<p>Zis ist a tesht.</p>'
    });
  });

});
