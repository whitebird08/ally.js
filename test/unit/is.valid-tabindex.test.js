define([
  'intern!object',
  'intern/chai!expect',
  '../helper/fixtures/custom.fixture',
  '../helper/supports',
  'ally/is/valid-tabindex',
], function(registerSuite, expect, customFixture, supports, isValidTabindex) {

  registerSuite(function() {
    var fixture;

    return {
      name: 'is/valid-tabindex',

      beforeEach: function() {
        fixture = customFixture([
          '<div id="non-tabindex"></div>',
          '<div id="tabindex--1" tabindex="-1"></div>',
          '<div id="tabindex-0" tabindex="0"></div>',
          '<div id="tabindex-1" tabindex="1"></div>',
          '<div id="tabindex-0-space" tabindex="0 "></div>',
          '<div id="tabindex-0-char" tabindex="0char"></div>',
          '<div id="tabindex-bad" tabindex="bad"></div>',
          '<div id="tabindex-empty" tabindex=""></div>',
        ]);
      },
      afterEach: function() {
        fixture.remove();
        fixture = null;
      },

      invalid: function() {
        expect(function() {
          isValidTabindex(null);
        }).to.throw(TypeError, 'is/valid-tabindex requires an argument of type Element');
      },
      'non-tabindex': function() {
        var element = document.getElementById('non-tabindex');
        // expect(element.tabIndex).to.equal(-1);
        // IE: 0, rest: -1
        expect(isValidTabindex(element)).to.equal(false);
      },
      'tabindex "-1"': function() {
        var element = document.getElementById('tabindex--1');
        expect(element.tabIndex).to.equal(-1);
        expect(isValidTabindex(element)).to.equal(true);
      },
      'tabindex "0"': function() {
        var element = document.getElementById('tabindex-0');
        expect(element.tabIndex).to.equal(0);
        expect(isValidTabindex(element)).to.equal(true);
      },
      'tabindex "0 " (trailing space)': function() {
        var element = document.getElementById('tabindex-0-space');
        expect(element.tabIndex).to.equal(0);
        expect(isValidTabindex(element)).to.equal(true);
      },
      'tabindex "0char" (trailing non-numeric characters)': function() {
        var element = document.getElementById('tabindex-0-char');
        expect(element.tabIndex).to.equal(0);
        expect(isValidTabindex(element)).to.equal(supports.allowsTrailingCharacters);
      },
      'tabindex "1"': function() {
        var element = document.getElementById('tabindex-1');
        expect(element.tabIndex).to.equal(1);
        expect(isValidTabindex(element)).to.equal(true);
      },
      'tabindex "bad"': function() {
        var element = document.getElementById('tabindex-bad');
        // expect(element.tabIndex).to.equal(-1);
        // IE: 0, rest: -1
        expect(isValidTabindex(element)).to.equal(supports.canFocusInvalidTabindex);
      },
      'tabindex ""': function() {
        var element = document.getElementById('tabindex-empty');
        // expect(element.tabIndex).to.equal(-1);
        // IE: 0, rest: -1
        expect(isValidTabindex(element)).to.equal(supports.canFocusInvalidTabindex);
      },
    };
  });
});
