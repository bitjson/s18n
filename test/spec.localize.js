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
      /`nativeLocale`/,
      'unexpected error message');
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
      /`locales`/,
      'unexpected error message');
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
      /`locales`/,
      'unexpected error message');
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

  it('should preserve and ignore insignificant whitespace when localizing', function() {
    var html = '< test test = "  test\n" testattr = \'  \t test \'> test\r \t</ test >';
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
      accents: '< test test = "  tést\n" testattr = \'  \t tést \'> tést\r \t</ test >'
    });
  });

  it('should localize the longest match when multiple locale strings match', function() {
    var html = '<p>This is a test <a href="#">link</a>.</p>';
    var nativeLocale = {
      '2a304a13': 'link',
      '455a8735': 'This is a test <a href="#">link</a>.'
    };
    var accentedLocale = {
      '2a304a13': 'whích fáíléd',
      '455a8735': 'Thís ís á tést <a href="#">línk</a>.'
    };
    var localizedHtml = s18n(html, {
      nativeLocale: nativeLocale,
      locale: accentedLocale
    });
    assert.equal(localizedHtml, '<p>Thís ís á tést <a href="#">línk</a>.</p>');
  });

  it('should ignore empty attributes in the native locale (output by htmlparser2)', function() {
    var html = '<p>This is a test <button href="#" disabled>button</button>.</p>';
    var nativeLocale = {
      'c82e7e85': 'This is a test <button href="#" disabled="">button</button>.'
    };
    var accentedLocale = {
      'c82e7e85': 'Thís ís á tést <button href="#" disabled="">búttón</button>.'
    };
    var localizedHtml = s18n(html, {
      nativeLocale: nativeLocale,
      locale: accentedLocale
    });
    assert.equal(localizedHtml, '<p>Thís ís á tést <button href="#" disabled="">búttón</button>.</p>');
  });

  it('should match extra spaces not in the native locale (due to htmlparser2-cleaned output)', function() {
    var html = '<p>This is a test <  button  \n href="#" >button< /\tbutton >.</p>';
    var nativeLocale = {
      'c82e7e85': 'This is a test <button href="#">button</button>.'
    };
    var accentedLocale = {
      'c82e7e85': 'Thís ís á tést <button href="#">búttón</button>.'
    };
    var localizedHtml = s18n(html, {
      nativeLocale: nativeLocale,
      locale: accentedLocale
    });
    assert.equal(localizedHtml, '<p>Thís ís á tést <button href="#">búttón</button>.</p>');
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
