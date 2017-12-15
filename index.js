"use strict";

module.exports = function vanillaShake() {
  let defined, definedKeys;

  const isDefined = (name) => definedKeys.includes(name);

  return {
    visitor: {
      Program(path, PluginPass) {
        defined = PluginPass.opts.defined;
        definedKeys = Object.keys(defined || {});
      },
      Conditional: {
        exit
      }
    }
  };

  function exit(path) {
    const test = path.node.test;
    const {name, operator, type, argument} = test;

    if (evaluateUnary()) return;
    if (evaluateIdentifier()) return;

    function evaluateUnary() {
      if (type !== "UnaryExpression" || operator !== "!") return;
      evaluateDefined(argument.name, true);
      return true;
    }

    function evaluateIdentifier() {
      if (type !== "Identifier") return;
      evaluateDefined(name, false);
      return true;
    }

    function evaluateDefined(definedName, condition) {
      if (!isDefined(definedName)) return;

      if (defined[definedName] === condition) {
        replace(path.get("alternate"));
      } else {
        replace(path.get("consequent"));
      }
    }

    function replace({node} = {}) {
      if (!node) {
        path.remove();
        return;
      }

      if (node.type === "BlockStatement") {
        path.replaceWithMultiple(node.body);
      } else {
        path.replaceWith(node);
      }
    }
  }
};
