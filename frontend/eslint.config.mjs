import eslintConfigPrettier from 'eslint-config-prettier';
import {
  createBrowserJsConfig,
  createNodeJsConfig,
  ignoreConfig,
} from '../packages/eslint-config/shared.mjs';

export default [
  ignoreConfig,
  createBrowserJsConfig(['js/**/*.{js,mjs,cjs}']),
  createNodeJsConfig(['eslint.config.mjs']),
  eslintConfigPrettier,
];
