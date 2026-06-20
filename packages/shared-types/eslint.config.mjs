import eslintConfigPrettier from 'eslint-config-prettier';
import { createNodeJsConfig, createNodeTsConfig, ignoreConfig } from '../../eslint/shared.mjs';

export default [
  ignoreConfig,
  createNodeJsConfig(['eslint.config.mjs']),
  createNodeTsConfig(['src/**/*.{ts,tsx}']),
  eslintConfigPrettier,
];
