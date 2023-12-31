/** @type {import('@typescript-eslint/experimental-utils').TSESLint.Linter.Config} */
module.exports = {
  "$schema": "https://json.schemastore.org/eslintrc",
  "root": true,
  "ignorePatterns": "projects/**/*",
  "overrides": [
    {
      "files":["*.ts"],
      "parserOptions": {
        "project": ["./tsconfig.json"],
        "tsconfigRootDir": __dirname,
        "createDefaultProgram": true
      },
      "extends": [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:@angular-eslint/recommended",
        "plugin:@angular-eslint/template/process-inline-templates"
      ]
    },
    {
      "files": ["*.html"],
      "extends": [
        "plugin:@angular-eslint/template/recommended",
        "plugin:@angular-eslint/template/accessibility"
      ]
    },
    {
      "files": ["*.js"],
      "parserOptions": {
        "sourceType": "module",
        "ecmaVersion": "latest"
      }
    }
  ]
}
