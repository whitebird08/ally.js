define([
  'intern!object',
  'intern/chai!expect',
  '../helper/fixtures/shadow-input.fixture',
  '../helper/elements-string',
  '../helper/supports',
  'ally/style/focus-within',
], function(registerSuite, expect, shadowInputFixture, elementsString, supports, styleFocusWithin) {

  registerSuite(function() {
    var fixture;
    var handle;

    function focusWithinElements(context) {
      return elementsString((context || document).querySelectorAll('.ally-focus-within'));
    }

    return {
      name: 'style/focus-within',

      beforeEach: function() {
        fixture = shadowInputFixture();
      },
      afterEach: function() {
        // make sure a failed test cannot leave listeners behind
        handle && handle.disengage({ force: true });
        fixture.remove();
        fixture = null;
      },

      lifecycle: function() {
        expect(focusWithinElements()).to.equal('', 'before engage');

        handle = styleFocusWithin();
        expect(handle.disengage).to.be.a('function');

        if (document.activeElement === document.documentElement) {
          // Internet Explorer 10 initially focuses <html>
          // NOTE: blur() on document does nothing, you actually need to focus() the body
          // document.activeElement.blur();
          document.body.focus();
        }

        expect(document.activeElement).to.equal(document.body, 'initial focus');
        expect(focusWithinElements()).to.equal('html, body', 'after engage');

        handle.disengage();
        handle = null;
        expect(focusWithinElements()).to.equal('', 'after disengage');
      },
      'follow focus': function() {
        expect(focusWithinElements()).to.equal('', 'before engage');

        if (document.activeElement === document.documentElement) {
          // Internet Explorer 10 initially focuses <html>
          // NOTE: blur() on document does nothing, you actually need to focus() the body
          // document.activeElement.blur();
          document.body.focus();
        }

        handle = styleFocusWithin();
        expect(focusWithinElements()).to.equal('html, body', 'after engage');

        fixture.input.outer.focus();
        expect(document.activeElement).to.equal(fixture.input.outer);
        expect(focusWithinElements()).to.equal('html, body, #intern-dom-fixture, #outer-input', 'outer sequence');

        fixture.input.after.focus();
        expect(document.activeElement).to.equal(fixture.input.after);
        expect(focusWithinElements()).to.equal('html, body, #intern-dom-fixture, #after-wrapper, #after-input', 'after sequence');
      },
      'follow focus into Shadow DOM': function() {
        if (!supports.cssShadowPiercingDeepCombinator) {
          this.skip('Shadow DOM "shadow-piercing descendant combinator" not supported');
        }

        var deferred = this.async(10000);
        expect(focusWithinElements()).to.equal('', 'before engage');

        handle = styleFocusWithin();
        expect(focusWithinElements()).to.equal('html, body', 'after engage');

        fixture.input.first.focus();
        // @browser-issue Gecko https://bugzilla.mozilla.org/show_bug.cgi?id=1117535
        if (document.activeElement === fixture.input.first) {
          expect(document.activeElement).to.equal(fixture.input.first);
          expect(focusWithinElements())
            .to.equal('html, body, #intern-dom-fixture, #first-shadow-host', 'first sequence');
          deferred.resolve();
          return;
        }

        expect(document.activeElement).to.equal(fixture.shadow.first);
        expect(focusWithinElements())
          .to.equal('html, body, #intern-dom-fixture, #first-shadow-host', 'first sequence');
        expect(focusWithinElements(fixture.shadow.first.shadowRoot))
          .to.equal('#first-input', 'first sequence in host');

        fixture.input.second.focus();
        // shadow dom updates are performed asynchronous
        // (async introduced by event/shadow-focus)
        setTimeout(deferred.callback(function() {
          expect(focusWithinElements())
            .to.equal('html, body, #intern-dom-fixture, #first-shadow-host', 'second sequence');
          expect(focusWithinElements(fixture.shadow.first.shadowRoot))
            .to.equal('#second-shadow-host', 'second sequence in first host');
          expect(focusWithinElements(fixture.shadow.second.shadowRoot))
            .to.equal('#second-input', 'second sequence in second host');

          // make sure classes are removed upon leaving the ShadowRoot
          fixture.input.after.focus();
          expect(focusWithinElements())
            .to.equal('html, body, #intern-dom-fixture, #after-wrapper, #after-input', 'after sequence');
          expect(focusWithinElements(fixture.shadow.first.shadowRoot))
            .to.equal('', 'after sequence in first host');
          expect(focusWithinElements(fixture.shadow.second.shadowRoot))
            .to.equal('', 'after sequence in second host');
        }), 100);
      },
    };
  });
});
