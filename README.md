# waterhouse [![Build Status](https://travis-ci.org/nickb1080/waterhouse.svg?branch=master)](https://travis-ci.org/nickb1080/waterhouse)

Proof-of-concept using and creating functions from another execution context. 

Doesn't work in Chrome 37 since `eval` in `iframe` contexts [is broken](https://code.google.com/p/chromium/issues/detail?id=412173). 

Works in 38+ and at least Node `0.10.32`

Here's a browser snippet to test support (`true` if supported, else `false`):
```js
(function testIFrameEval () {
  var frame = document.createElement('iframe');
  frame.style.display = 'none';
  document.body.appendChild(frame);
  var win = frame.contentWindow;
  win.eval("var evalInFrame = true");
  var result = win.evalInFrame;
  document.body.removeChild(frame);
  return !!result;
})();
```
