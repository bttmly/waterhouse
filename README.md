# Waterhouse

Proof-of-concept using and creating functions from another execution context. Doesn't work in current Chrome (37) since `eval` in `iframe` contexts [is broken](https://code.google.com/p/chromium/issues/detail?id=412173). Working in Chrome Canary (40) and Node `0.10.32`.
