// @ts-check
import eslint from '@eslint/js';
import stylistic from '@stylistic/eslint-plugin';
import tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';

export default tseslint.config(
    {
        ignores: ['node_modules/**', 'dist/**', '.idea/**', '.vscode/**'],
    },
    {
        files: ['**/*.{ts,tsx}'],
        plugins: { '@stylistic': stylistic },
        extends: [
            eslint.configs.recommended,
            ...tseslint.configs.strict,
            ...tseslint.configs.stylistic,
            reactHooks.configs.flat['recommended-latest'],
        ],
        languageOptions: {
            parserOptions: {
                projectService: true,
                tsconfigRootDir: import.meta.dirname,
            },
        },
        rules: {
            'no-debugger': ['error'],
            'no-console': ['warn', { allow: ['error'] }],
            '@stylistic/max-len': [
                'error',
                {
                    code: 100,
                    tabWidth: 4,
                    ignoreComments: true,
                    ignoreTrailingComments: true,
                    ignoreUrls: true,
                    ignoreStrings: true,
                    ignoreTemplateLiterals: true,
                    ignoreRegExpLiterals: true,
                },
            ],
            '@stylistic/quotes': ['error', 'single'],
            '@typescript-eslint/no-explicit-any': ['warn'],
            '@typescript-eslint/no-non-null-assertion': ['off'],
            '@typescript-eslint/no-unused-vars': [
                'error',
                { argsIgnorePattern: '^_' },
            ],
        },
    },
);
