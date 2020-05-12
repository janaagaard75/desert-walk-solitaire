module.exports = {
  parser: "@typescript-eslint/parser",
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier/@typescript-eslint",
    "plugin:prettier/recommended",
  ],
  parserOptions: {
    project: "./tsconfig.json",
    sourceType: "module",
  },
  settings: {
    react: {
      version: "detect",
    },
  },
  env: { browser: true, node: true },
  rules: {
    "@typescript-eslint/array-type": [
      "error",
      {
        default: "generic",
        readonly: "generic",
      },
    ],
    // Mandatory return types is too verbose for my taste.
    "@typescript-eslint/explicit-function-return-type": "off",
    // Empty constructors make sense for singleton classes.
    "@typescript-eslint/no-empty-function": [
      "error",
      { allow: ["constructors"] },
    ],
    // Let TypeScript test for unused variables.
    "@typescript-eslint/no-unused-vars": "off",
  },
}
