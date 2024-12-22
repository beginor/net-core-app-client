import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

import tseslint from 'typescript-eslint';

import rootConfig from '../eslint.config.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default tseslint.config(
  ...rootConfig,
  // {
  //   "files": ["**/*.ts"],
  //   'languageOptions': {
  //     'parserOptions': {
  //       'project': ['./tsconfig.app.json'],
  //       'tsconfigRootDir': __dirname,
  //       'createDefaultProgram': true,
  //     }
  //   },
  //   "rules": {

  //   }
  // },
  // {
  //   "files": ["**/*.html"],
  //   "rules": {}
  // }
);
