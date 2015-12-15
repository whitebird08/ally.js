define([], function() {
  return function(html, context) {
    var previous = document.getElementById('intern-dom-fixture');
    if (previous) {
      // it appears as if Intern's afterEach() is not executed reliably in IE10
      if (document.activeElement === null) {
        // IE10 does not redirect focus to <body> when the activeElement is removed
        document.body.focus();
      }

      document.activeElement && document.activeElement.blur();
      previous.parentNode.removeChild(previous);
    }

    var fixture = {
      root: document.createElement('div'),
      remove: function() {
        // IE10 does not redirect focus to <body> when the activeElement is removed
        // blur shadowed activeElements before removal
        // @browser-issue Gecko https://bugzilla.mozilla.org/show_bug.cgi?id=1117535#c5
        document.activeElement && document.activeElement.blur();
        fixture.root.parentNode.removeChild(fixture.root);
      },
      add: function(_html, id) {
        var div = document.createElement('div');
        div.innerHTML = typeof _html !== 'string' ? _html.join('') : _html;
        if (id) {
          div.id = id;
        }

        fixture.root.appendChild(div);
        return div;
      },
      nodeToString: function(element) {
        return element.id && ('#' + element.id)
          || element.getAttribute('data-label')
          || element.nodeName.toLowerCase();
      },
    };

    fixture.root.id = 'intern-dom-fixture';
    fixture.root.innerHTML = typeof html !== 'string' ? html.join('') : html;
    (context || document.body).appendChild(fixture.root);
    return fixture;
  };
});
