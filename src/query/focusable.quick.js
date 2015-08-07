
// http://www.w3.org/TR/html5/editing.html#focusable
// http://www.w3.org/WAI/PF/aria-practices/#keyboard

import selector from '../selector/focusable';
import isFocusable from '../is/focusable';

export default function queryFocusableQuick({context, includeContext} = {}) {
  var elements = context.querySelectorAll(selector);
  // the selector potentially matches more than really is focusable
  var result = [].filter.call(elements, isFocusable);
  // add context if requested and focusable
  if (includeContext && isFocusable(context)) {
    result.unshift(context);
  }

  return result;
}