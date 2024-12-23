import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

import tseslint from 'typescript-eslint';

import rootConfig from '../eslint.config.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default tseslint.config(
  ...rootConfig,
  {
    "files": ["**/*.ts"],
    "rules": {
      "@angular-eslint/directive-selector": [
        "error",
        { "type": "attribute", "prefix": "lib", "style": "camelCase" }
      ],
      "@angular-eslint/component-selector": [
        "error",
        { "type": "element", "prefix": "lib", "style": "kebab-case" }
      ]
    }
  }
);
