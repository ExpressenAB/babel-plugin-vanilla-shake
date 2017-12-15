"use strict";

const babel = require("babel-core");
const plugin = require("../");
const {expect} = require("chai");

const defaultOpts = {
  presets: [
    ["env", {
      "modules": false,
      "targets": {
        "browsers": [
          "Last 2 versions",
          "IE 11"
        ]
      }
    }]
  ]
};

it("leaves unaltered if conditions are not present", () => {
  const example = `
    var foo = 1;
    if (SHOULD_KEEP) console.log(foo);
  `;

  const expected = "\nvar foo = 1;\nif (SHOULD_KEEP) console.log(foo);";

  const {code} = babel.transform(example, Object.assign({plugins: [plugin]}, defaultOpts));
  expect(code).to.equal(expected);
});

it("removes block if defined condition is false", () => {
  const example = `
  var foo = 1;
  if (SHOULD_KEEP) console.log(foo);
  `;

  const expected = "\nvar foo = 1;";

  const {code} = babel.transform(example, Object.assign({plugins: [[plugin, {defined: {SHOULD_KEEP: false}}]]}, defaultOpts));
  expect(code).to.equal(expected);
});

it("keeps block if defined condition is true, but removes condition", () => {
  const example = `
  var foo = 1;
  if (SHOULD_KEEP) console.log(foo);
  `;

  const expected = "\nvar foo = 1;\nconsole.log(foo);";

  const {code} = babel.transform(example, Object.assign({plugins: [[plugin, {defined: {SHOULD_KEEP: true}}]]}, defaultOpts));
  expect(code).to.equal(expected);
});

it("removes scoped block if defined condition is false", () => {
  const example = `
  const foo = 1;
  if (SHOULD_KEEP) {
    console.log(foo);
    console.log(foo + 1);
  }
  `;

  const expected = "\nvar foo = 1;";

  const {code} = babel.transform(example, Object.assign({plugins: [[plugin, {defined: {SHOULD_KEEP: false}}]]}, defaultOpts));
  expect(code).to.equal(expected);
});

it("keeps scoped block if defined condition is true", () => {
  const example = `
  let foo = 1;

  if (SHOULD_KEEP) {
    const bar = 1;
    console.log(foo);
    console.log(bar);
  }

  if (SHOULD_KEEP) {
    const bar = 2;
    console.log(foo);
    console.log(bar);
  }
  `;

  const expected = "\n" +
    "var foo = 1;\n" +
    "\n" +
    "var bar = 1;\n" +
    "console.log(foo);\n" +
    "console.log(bar);\n" +
    "\n" +
    "var _bar = 2;\n" +
    "console.log(foo);\n" +
    "console.log(_bar);";

  const {code} = babel.transform(example, Object.assign({plugins: [[plugin, {defined: {SHOULD_KEEP: true}}]]}, defaultOpts));
  expect(code).to.equal(expected);
});

it("removes scoped block if defined condition is true, but test evaluates to false", () => {
  const example = `
  const foo = 1;
  if (!SHOULD_KEEP) {
    console.log(foo);
    console.log(foo + 1);
  }
  `;

  const expected = "\nvar foo = 1;";

  const {code} = babel.transform(example, Object.assign({plugins: [[plugin, {defined: {SHOULD_KEEP: true}}]]}, defaultOpts));
  expect(code).to.equal(expected);
});
