define([
  'intern!object',
  'intern/chai!expect',
  '../support/fixtures/shadow-input.fixture',
  'ally/get/active-elements',
], function(registerSuite, expect, shadowInputfixture, getActiveElements) {

  registerSuite(function() {
    var fixture;

    return {
      name: 'get/active-elements',

      beforeEach: function() {
        fixture = shadowInputfixture();
      },
      afterEach: function() {
        fixture.remove();
        fixture = null;
      },

      'inactive document': function() {
        document.activeElement.blur();
        var active = getActiveElements();
        expect(active.length).to.equal(1);
        expect(active[0]).to.equal(document.body);
      },
      'active in document': function() {
        fixture.input.outer.focus();
        var active = getActiveElements();
        expect(active.length).to.equal(1);
        expect(active[0]).to.equal(document.activeElement);
      },
      'active in ShadowHost': function() {
        if (!fixture.shadow.first) {
          this.skip('Shadow DOM not supported');
        }

        fixture.input.first.focus();
        var active = getActiveElements();
        expect(active.length).to.equal(2);
        expect(active[0]).to.equal(fixture.input.first);
        expect(active[1]).to.equal(fixture.shadow.first);
      },
      'active in nested ShadowHost': function() {
        if (!fixture.shadow.first) {
          this.skip('Shadow DOM not supported');
        }

        fixture.input.second.focus();
        var active = getActiveElements();
        expect(active.length).to.equal(3);
        expect(active[0]).to.equal(fixture.input.second);
        expect(active[1]).to.equal(fixture.shadow.second);
        expect(active[2]).to.equal(fixture.shadow.first);
      },
    };
  });
});
