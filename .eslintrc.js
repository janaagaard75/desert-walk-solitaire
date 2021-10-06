module.exports = {
  parser: "@typescript-eslint/parser",
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
    "prettier",
  ],
  parserOptions: {
    project: "./tsconfig.json",
    sourceType: "module",
  },
  // Ignore .js files since we're coding in TypeScript.
  ignorePatterns: ["**/*.js"],
  settings: {
    react: {
      version: "detect",
    },
  },
  env: {
    es2020: true,
    node: true,
  },
  rules: {
    // Use the Array<foo> syntax instead of foo[] in types.
    "@typescript-eslint/array-type": [
      "error",
      {
        default: "generic",
        readonly: "generic",
      },
    ],

    // Mandatory return types is too verbose for my taste.
    "@typescript-eslint/explicit-module-boundary-types": "off",

    // Empty constructors make sense for singleton classes.
    "@typescript-eslint/no-empty-function": [
      "error",
      {
        allow: ["constructors"],
      },
    ],

    // Allow empty interfaces since Props might be empty.
    "@typescript-eslint/no-empty-interface": "off",

    // Allow assigning things that are `any` since this is what the `require` function returns.
    "@typescript-eslint/no-unsafe-assignment": "off",

    // Allow unsafe calls since `makeObservable` triggers this error.
    "@typescript-eslint/no-unsafe-call": "off",

    // Do not allow any unused variables except the ones prefixed with an underscore.
    "@typescript-eslint/no-unused-vars": [
      "off",
      {
        args: "all",
        argsIgnorePattern: "^_",
      },
    ],

    // Require that switch statements handle all cases.
    "@typescript-eslint/switch-exhaustiveness-check": "error",

    // Always use strict comparisons.
    eqeqeq: "error",

    // Use fat arrow function style.
    "func-style": "error",

    // Forbid reassigning parameters.
    "no-param-reassign": "error",

    // Prefer const over let.
    "prefer-const": "error",

    // Prefer template strings over concatenating with plus.
    "prefer-template": "error",
  },
}
