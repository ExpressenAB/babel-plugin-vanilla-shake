vanilla-shake
=============
[![Build Status](https://travis-ci.org/ExpressenAB/babel-plugin-vanilla-shake.svg?branch=master)](https://travis-ci.org/ExpressenAB/babel-plugin-vanilla-shake)

vanilla conditional compile plugin for babel.

consider this:
```js
const foo = 1;
const bar = 2;
if (SHOULD_KEEP) {
  console.log(foo);
} else if (SHOULD_KEEP_2) {
  console.log(bar);
} else {
  console.log("hej")
}
```

configure the plugin like this:

```js
{
  plugins: [["vanilla-shake", {
    defined: {
      SHOULD_KEEP: false,
      SHOULD_KEEP_2: true
    }
  }]]
}
```

after code is transpiled with the configured plugin:
```js
const foo = 1;
const bar = 2;

console.log(bar);
```

