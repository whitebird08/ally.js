define([
  'intern!object',
  'intern/chai!expect',
  'intern/dojo/Promise',
  '../helper/browser-focusable-frame',
  '../helper/browser-focusable-data',
  'platform',
  'ally/is/focusable',
  'ally/is/tabbable',
  'ally/is/only-tabbable',
  'ally/query/tabsequence',
], function(
  registerSuite,
  expect,
  Promise,
  FocusableTestFrame,
  focusableTestData,
  platform,
  isFocusable,
  isTabbable,
  isOnlyTabbable,
  queryTabsequence
) {
  registerSuite(function() {

    function keysMap(list) {
      var map = {};
      list.forEach(function(key) {
        map[key] = true;
      });
      return map;
    }

    var framed = new FocusableTestFrame();

    var data = focusableTestData(platform);
    var noDataMessage = 'No data to compare for ' + platform.name + ' ' + platform.version;
    var skipUntestable = keysMap([
      'ignore',
      'html',
      'body',
      'iframe',
      'iframe{focusable} -> input',
      'iframe -> body',
      'iframe{focusable} -> body',
      'svg rect[onfocus]',
      'keygen',
      'keygen[tabindex=-1]',
    ]);
    var skipOnBrowserstack = keysMap([
      'embed',
      'embed[tabindex=-1]',
      'embed[type=mp4]',
      'embed[type=mp4][tabindex=-1]',
      'embed[type=ogv]',
      'embed[type=ogv][tabindex=-1]',
      'embed[type=svg]',
      'embed[type=svg][tabindex=-1]',
      'embed[type=svg][tabindex=0]',
      'object',
      'object[src=swf]',
      'object[src=swf][height=0]',
      'object[src=swf][tabindex=-1]',
      'object[src=svg]',
      'object[src=svg][tabindex=-1]',
      'object[src=svg][height=0]',
      'object[usemap]',
    ]);

    var suite = {
      name: 'browser-focusable',

      before: function() {
        return framed.initialize(document.body);
      },
      after: function() {
        framed.cleanup();
      },
      'browser version': function() {
        var ident = data.platform.name + ' ' + data.platform.version;
        if (data) {
          this.skip('Checking against ' + ident);
        }

        expect('').to.equal(ident, 'Test data available');
      },
    };

    function generateTest(label) {
      return function() {
        var element = framed.getElement(label);

        var focusable = Boolean(data.is.focusable[label]);
        var tabbable = focusable && Boolean(data.is.tabbable[label]);
        var onlyTabbable = !focusable && Boolean(data.is.tabbable[label]);

        var _focusable = isFocusable(element);
        // isTabbable() does not run isFocusable() internally
        var _tabbable = _focusable && isTabbable(element);
        var _onlyTabbable = isOnlyTabbable(element);

        expect(_focusable).to.equal(focusable, 'is/focusable');
        expect(_tabbable).to.equal(tabbable, 'is/tabbable');
        expect(_onlyTabbable).to.equal(onlyTabbable, 'is/only-tabbable');
      };
    }

    function generateSkipped(message) {
      return function() {
        this.skip(message);
      };
    }

    framed.labels.forEach(function(label) {
      suite[label] = !data && generateSkipped(noDataMessage)
        || skipUntestable[label] && generateSkipped('Not testable in a stable way')
        || skipOnBrowserstack[label] && generateSkipped('Cannot test on BrowserStack')
        || generateTest(label);
    });

    suite.tabsequence = data && function() {
      var ignored = function(label) {
        return !skipUntestable[label] && !skipOnBrowserstack[label];
      };

      var expected = data.is.tabsequence.filter(ignored);
      var sequence = queryTabsequence({
        context: framed.document.body,
        strategy: 'strict',
      }).map(function(element) {
        return element.getAttribute('data-label');
      }).filter(ignored);

      expect(sequence).to.deep.equal(expected);
    } || generateSkipped(noDataMessage);

    return suite;
  });
});
