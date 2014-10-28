define(function defineDomQueryFocusable(require) {
  'use strict';

  // http://www.w3.org/TR/html5/editing.html#focusable
  // http://www.w3.org/WAI/PF/aria-practices/#keyboard

  var selector = require('../selector/focusable');
  var isFocusable = require('../dom/is-focusable');

  function queryFocusable(context) {
    var elements = context.querySelectorAll(selector);
    // the selector potentially matches more than really is focusable
    return [].filter.call(elements, isFocusable);
  }

  return queryFocusable;
});