// @ts-check

import eslint from '@eslint/js';
import stylistic from '@stylistic/eslint-plugin'
import tseslint from 'typescript-eslint';
import angular from 'angular-eslint';

export default tseslint.config(
  {
    files: ['projects/**/*.ts'],
    plugins: {
      '@stylistic': stylistic
    },
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
        createDefaultProgram: true,
      }
    },
    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.strict,
      ...tseslint.configs.stylisticTypeChecked,
      ...angular.configs.tsRecommended,
    ],
    processor: angular.processInlineTemplates,
    rules: {
      'no-debugger': 'error',
      'no-console': ['warn', { allow: ['error'] }],
      '@stylistic/max-len': [
        'error', {
          code: 80,
          tabWidth: 4,
          ignoreComments: true,
          ignoreTrailingComments: true,
          ignoreUrls: true,
          ignoreStrings: true,
          ignoreTemplateLiterals: true,
          ignoreRegExpLiterals: true,
        }
      ],
      '@stylistic/quotes': ['error', 'single'],
      '@typescript-eslint/explicit-function-return-type': [
        'error',
        {
          allowConciseArrowFunctionExpressionsStartingWithVoid: false,
          allowDirectConstAssertionInArrowFunctions: true,
          allowedNames: [],
          allowExpressions: false,
          allowFunctionsWithoutTypeParameters: false,
          allowHigherOrderFunctions: true,
          allowIIFEs: false,
          allowTypedFunctionExpressions: true,
        },
      ],
      '@typescript-eslint/explicit-member-accessibility': [
        'error',
        {
          accessibility: 'explicit',
          ignoredMethodNames: [],
          overrides: {
            accessors: 'explicit', constructors: 'off', methods: 'explicit',
            parameterProperties: 'explicit', properties: 'explicit',
          }
        }
      ],
      "@angular-eslint/directive-selector": [
        "error",
        { type: "attribute", prefix: "app", style: "camelCase" }
      ],
      "@angular-eslint/component-selector": [
        "error",
        { type: "element", prefix: "app", style: "kebab-case" }
      ]
    },
  },
  {
    files: ['projects/**/*.html'],
    extends: [
      ...angular.configs.templateRecommended,
      ...angular.configs.templateAccessibility,
    ],
    rules: {
      '@angular-eslint/template/click-events-have-key-events': ['off'],
      '@angular-eslint/template/interactive-supports-focus': ['off']
    },
  },
  {
    ignores: [
      'node_modules/**',
      'dist/**',
      '.angular/**',
      '.idea/**',
      '.vscode/**',
      '.git/**',
    ]
  }
);
