{
  "parser": "@typescript-eslint/parser",
  "extends": [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier/@typescript-eslint",
    "plugin:prettier/recommended"
  ],
  "parserOptions": {
    "project": "./tsconfig.json",
    "sourceType": "module"
  },
  "settings": {
    "react": {
      "version": "detect"
    }
  },
  "env": { "browser": true, "node": true },
  "rules": {
    "@typescript-eslint/array-type": [
      "error",
      {
        "default": "generic",
        "readonly": "generic"
      }
    ],
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/no-empty-function": [
      "error",
      { "allow": ["constructors"] }
    ],
    "@typescript-eslint/no-unused-vars": "off"
  }
}
