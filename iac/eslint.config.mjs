import eslintConfigPrettier from 'eslint-config-prettier';
import { createNodeJsConfig, createNodeTsConfig, ignoreConfig } from '../eslint/shared.mjs';

export default [
  ignoreConfig,
  createNodeJsConfig(['eslint.config.mjs']),
  createNodeTsConfig(['bin/**/*.{ts,tsx}', 'lib/**/*.{ts,tsx}']),
  eslintConfigPrettier,
];
