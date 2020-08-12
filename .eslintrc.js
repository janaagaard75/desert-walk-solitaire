module.exports = {
  parser: "@typescript-eslint/parser",
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:@typescript-eslint/recommended",
    // Consider adding these rules. This requires parserOptions.project to be set, and ESLint will then complain about .js files not being included.
    // "plugin:@typescript-eslint/recommended-requiring-type-checking",
    "prettier/@typescript-eslint",
    "plugin:prettier/recommended",
  ],
  // parserOptions: {
  //   project: "./tsconfig.json",
  //   sourceType: "module",
  // },
  // Ignore .js files since we're coding in TypeScript.
  ignorePatterns: ["**/*.js"],
  settings: {
    react: {
      version: "detect",
    },
  },
  env: { node: true },
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
      { allow: ["constructors"] },
    ],
    // Let TypeScript test for unused variables.
    "@typescript-eslint/no-unused-vars": "off",
  },
}
