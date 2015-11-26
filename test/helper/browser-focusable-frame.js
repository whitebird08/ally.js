define([
  'intern!object',
  'intern/chai!expect',
  'intern/dojo/Promise',
  'intern/dojo/text!../../tests/focusable/test.html',
  'css.escape',
], function(
  registerSuite,
  expect,
  Promise,
  sourceHtml,
  cssEscape
) {

  var source = sourceHtml
    // remove <script src="…"> because we don't want to run the tests
    // but add prototype scripts
    .replace(/<script\s+src="[^>]+><\/script>/g, '')
    // add <base> to re-target assets (relative from node_modules/intern/client.html)
    .replace('</title>', '</title><base href="../../tests/focusable/">');

  function Framed(_source) {
    this.source = _source || source;
    this.labels = this._extractLabels();
    this.iframe = null;
    this.window = null;
    this.document = null;
  }

  Framed.prototype.prepareHtml = function(html) {
    // remove <object> and <embed> elements avoid blocking QuickTime upgrade dialog in IE on BrowserStack
    // see https://github.com/medialize/ally.js/pull/80#issuecomment-163602788
    return html
      .replace(/<object\s[\s\S]+?<\/object>/g, '')
      .replace(/<embed\s[^>]+>/g, '');
  };

  Framed.prototype._extractLabels = function() {
    var labels = [];
    this.source.replace(/data-label="([^"]+)"/g, function(match, label) {
      var _label = label.replace(/&quot;/g, '"');
      labels.push(_label);
    });
    return labels;
  };

  // returns a promise that resolves once the iframe's
  // content is fully loaded and ready for testing
  Framed.prototype.initialize = function(parent) {
    var dfd = new Promise.Deferred();
    var _html = this.prepareHtml(this.source);

    this.iframe = document.createElement('iframe');
    parent.appendChild(this.iframe);
    this.window = this.iframe.contentWindow;
    this.document = this.window.document;

    this.document.open();
    this.document.write(_html);
    this.document.close();

    if (!this.window) {
      dfd.reject();
      return dfd.promise;
    }

    this.window.addEventListener('load', function() {
      // Firefox needs some extra time in order to
      // consider ImageMaps linked. I dont even...
      setTimeout(dfd.resolve, 1000);
    }, false);
    // we may not see a load event
    setTimeout(dfd.resolve, 5000);
    return dfd.promise;
  };

  Framed.prototype.getElement = function(label) {
    return this.document.querySelector('[data-label="' + cssEscape(label) + '"]');
  };

  Framed.prototype.cleanup = function() {
    this.iframe.parentNode.removeChild(this.iframe);
    this.source = this.labels = this.iframe = this.window = this.document = null;
  };

  return Framed;
});
