module.exports = {
  env: {
    commonjs: false,
    es2021: true,
    es6: false,
    jest: false,
    node: false,
  },
  extends: ["react-app", "plugin:react/jsx-runtime"],
  ignorePatterns: ["**/*.css", "build/"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: "latest",
  },
  plugins: ["typescript-sort-keys"],
  rules: {
    // Always wrap in curly braces, even one-liners.
    curly: ["warn", "all"],

    // Always use strict equality comparison, that is === or !==.
    eqeqeq: ["warn", "always"],

    // Use fat arrow style when declaring functions.
    "func-style": ["warn", "expression"],

    // Do not allow alert boxes.
    "no-alert": "warn",

    // Do not use shorthands to convert between types.
    "no-implicit-coercion": "warn",

    // Prefer const or let over var.
    "no-var": "warn",

    // Use fat arrow style in callbacks.
    "prefer-arrow-callback": "warn",

    // Prefer const over let.
    "prefer-const": "warn",

    // Do not allow backtick strings unless they are template strings.
    quotes: ["warn", "double"],
  },
  overrides: [
    {
      // Rules that apply to JavaScript files in the root folder.
      files: ["./*.js"],
      env: {
        commonjs: true,
        node: true,
      },
    },
    {
      // Rules that only apply apply to TypeScript files. ESLint cannot lint JavaScript files if this is turned on for all files.
      files: ["*.ts", "*.tsx"],
      parserOptions: {
        project: ["./tsconfig.json"],
      },
      rules: {
        // Use Array<Foo> and ReadonlyArray<Foo> syntax to distinguish from empty array initializations and treat arrays like all other generic types.
        "@typescript-eslint/array-type": [
          "warn",
          {
            default: "generic",
            readonly: "generic",
          },
        ],

        // Prefer interfaces over types.
        "@typescript-eslint/consistent-type-definitions": ["warn", "interface"],

        // Require that all possible values are handled by switch statements.
        "@typescript-eslint/switch-exhaustiveness-check": "warn",

        // Require explicit accessibility modifiers since everything is public by default.
        "@typescript-eslint/explicit-member-accessibility": "warn",

        // Make sure something that returns void isn't used by accident.
        "@typescript-eslint/no-confusing-void-expression": "warn",

        // Do not allow unnecessary checks for null.
        "@typescript-eslint/no-unnecessary-condition": "warn",

        // Prefer template strings over concatenating with plus.
        "prefer-template": "warn",

        // Require that interface keys are sorted alphabetically.
        "typescript-sort-keys/interface": "warn",

        // Require string enum members are sorted alphabetically.
        "typescript-sort-keys/string-enum": "warn",

        // Only allow unused variables that are prefixed with an underscore. Use an ESLint rule instead of TypeScript's noUnusedLocals and noUnusedParameters to allow unused items when developing
        "@typescript-eslint/no-unused-vars": [
          "warn",
          {
            args: "all",
            argsIgnorePattern: "^_",
            vars: "all",
            varsIgnorePattern: "^_",
          },
        ],

        // Require explicit boolean expressions to avoid the ambiguities that JavaScript has, https://dorey.github.io/JavaScript-Equality-Table/#if-statement.
        "@typescript-eslint/strict-boolean-expressions": [
          "warn",
          {
            allowString: false,
            allowNumber: false,
            allowNullableObject: false,
            allowNullableBoolean: false,
            allowNullableString: false,
            allowNullableNumber: false,
            allowAny: false,
          },
        ],
      },
    },
  ],
};

// The command `npx eslint --print-config ./App.ts > eslint-config.json` prints the configuration rules for App.ts to eslint-config.json.
