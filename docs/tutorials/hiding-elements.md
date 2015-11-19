---
layout: doc-page.html
---

# Hiding DOM elements

This document explains the various ways of hiding things and their implications.

When we say an element is hidden, we usually mean it is not visible. However, the screen is not the only output mechanism we may need to hide content from. Systems like screen readers and braille displays rely on a document's representation in the [accessibility tree](../concepts.md#Accessibility-tree). For disambiguation we'll use the following terms:

* **Completely hidden:** The element is *neither* rendered on screen, *nor* exposed in the accessibility tree.
* **Semantically hidden:** The element is rendered on screen, but *not* exposed in the accessibility tree.
* **Visually hidden:** The element is *not* rendered on screen, but exposed in the accessibility tree.

The three types of "hidden" produce the following matrix:

| visibility state | on screen | in accessibility tree |
| ---------------- | --------- | --------------------- |
| completely hidden | hidden | hidden |
| semantically hidden | visible | hidden |
| visually hidden | hidden | visible |


## How to hide elements completely

Completely hiding elements can be done in 3 ways:

* via the CSS property [`display`](https://developer.mozilla.org/en-US/docs/Web/CSS/display), e.g. `display: none;`
* via the CSS property [`visibility`](https://developer.mozilla.org/en/docs/Web/CSS/visibility), e.g. `visibility: hidden;`
* via the HTML5 attribute [`hidden`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/hidden), e.g. `<span hidden>`

While each of these techniques has the same end result, namely content is not rendered and not exposed in the accessibility tree, they have different behaviors.

### The CSS properties `display` and `visibility`

`display: none;` will cause the element to completely vanish, it won't take any space and it won't be [animatable](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Transitions/Using_CSS_transitions). `visibility: hidden;` allows animation and preserves the space the element would occupy on screen, but simply leave it blank. Unlike every other method to hide content, `visibility` has the ability to unhide nested content:

```html
<div style="visibility: hidden">
  <span>not visible</span>
  <span style="visibility: visible">visible!</span>
</div>
```

Unless this is *specifically* what we intend to do, we should refrain from using `visibility: visible;` in our style sheets, and use `visibility: inherit;` instead. By inheriting the `visibility` state from the parent element by default, we make sure that nested content does not become visible by accident.

### The HTML5 `hidden` attribute

The HTML5 `hidden` attribute provides a convenient API, as it can be toggled simply by setting `element.hidden = true;`. The element itself does not hide the content, but browser's internal style sheets contain the following CSS rule:

```css
[hidden] {
  display: none;
}
```

### Safely overwriting the `hidden` attribute

We **absolutely must not** revert the hiding effects of the `hidden` attribute. However, we *can* swap `display` for `visibility` in certain situations, for example to allow us to animate the element:

```css
.my-element[hidden] {
  display: block;
  visibility: hidden;
}
```

Sadly we cannot use the values `inherit`, `initial` or `unset` to simply *undo* the `display: none;`. `initial` and `unset` would translate to `display: inline`, and `inherit` simply "imports" the `display` value of the parent element. We can use extended selectors to get around duplicate definitions:

```css
.my-element,
.my-element[hidden] {
  display: block;
  /* ... */
}
.my-element[hidden] {
  visibility: hidden;
}
```


## How to hide elements semantically

[`aria-hidden="true"`](http://www.w3.org/TR/wai-aria/states_and_properties#aria-hidden)


## How to hide elements visually

We may need to provide invisible content in order to make sure the structures presented in the accessibility tree make sense.

`aria-hidden="false"` with custom CSS on top:

* http://webaim.org/techniques/css/invisiblecontent/
* http://www.sitepoint.com/when-and-how-to-visually-hide-content/
* http://snook.ca/archives/html_and_css/hiding-content-for-accessibility


