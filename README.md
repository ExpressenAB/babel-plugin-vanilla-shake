vanilla-shake
=============
[![Build status](https://github.com/ExpressenAB/babel-plugin-vanilla-shake/actions/workflows/build.yaml/badge.svg?event=push)](https://github.com/ExpressenAB/babel-plugin-vanilla-shake/actions/workflows/build.yaml)

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

