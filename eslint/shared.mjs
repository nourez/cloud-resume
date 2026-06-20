import js from '@eslint/js';
import tsEslintPlugin from '@typescript-eslint/eslint-plugin';
import tsEslintParser from '@typescript-eslint/parser';
import globals from 'globals';

export const ignoreConfig = {
  ignores: [
    '**/node_modules/**',
    '**/dist/**',
    '**/build/**',
    '**/coverage/**',
    '**/cdk.out/**',
    '**/.cdk.staging/**',
  ],
};

export const createBrowserJsConfig = (files) => ({
  files,
  ...js.configs.recommended,
  languageOptions: {
    ...js.configs.recommended.languageOptions,
    globals: {
      ...globals.browser,
    },
  },
});

export const createNodeJsConfig = (files) => ({
  files,
  ...js.configs.recommended,
  languageOptions: {
    ...js.configs.recommended.languageOptions,
    globals: {
      ...globals.node,
    },
  },
});

export const createNodeTsConfig = (files) => ({
  files,
  languageOptions: {
    parser: tsEslintParser,
    parserOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    globals: {
      ...globals.node,
    },
  },
  plugins: {
    '@typescript-eslint': tsEslintPlugin,
  },
  rules: {
    ...js.configs.recommended.rules,
    ...tsEslintPlugin.configs.recommended.rules,
  },
});
