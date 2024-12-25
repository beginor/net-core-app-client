// @ts-check
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import angular from 'angular-eslint';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default tseslint.config(
  {
    'files': ['**/*.ts'],
    'languageOptions': {
      'parserOptions': {
        'project': ['./tsconfig.json'],
        'tsconfigRootDir': __dirname,
        'createDefaultProgram': true,
      }
    },
    'extends': [
      eslint.configs.recommended,
      ...tseslint.configs.recommended,
      ...tseslint.configs.stylistic,
      ...angular.configs.tsRecommended,
    ],
    processor: angular.processInlineTemplates,
    rules: {},
  },
  {
    'files': ['**/*.html'],
    'extends': [
      ...angular.configs.templateRecommended,
      ...angular.configs.templateAccessibility,
    ],
    rules: {},
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
