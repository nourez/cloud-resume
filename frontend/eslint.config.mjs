import eslintConfigPrettier from 'eslint-config-prettier';
import { createBrowserJsConfig, createNodeJsConfig, ignoreConfig } from '../eslint/shared.mjs';

export default [
  ignoreConfig,
  createBrowserJsConfig(['js/**/*.{js,mjs,cjs}']),
  createNodeJsConfig(['eslint.config.mjs']),
  eslintConfigPrettier,
];
