const tseslint = require('typescript-eslint');

const rootConfig = require('../eslint.config');

module.exports = tseslint.config(
  ...rootConfig,
  {
    "files": ["**/*.ts"],
    'languageOptions': {
      'parserOptions': {
        'project': ['./tsconfig.lib.json'],
        'tsconfigRootDir': __dirname,
        'createDefaultProgram': true,
      }
    },
    "rules": {
      "@angular-eslint/directive-selector": [
        "error",
        {
          "type": "attribute",
          "prefix": "lib",
          "style": "camelCase"
        }
      ],
      "@angular-eslint/component-selector": [
        "error",
        {
          "type": "element",
          "prefix": "lib",
          "style": "kebab-case"
        }
      ]
    }
  },
  {
    "files": ["**/*.html"],
    "rules": {}
  }
);
