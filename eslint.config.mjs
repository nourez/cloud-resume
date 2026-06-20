import eslintConfigPrettier from 'eslint-config-prettier';
import {
  createBrowserJsConfig,
  createNodeJsConfig,
  createNodeTsConfig,
  ignoreConfig,
} from './eslint/shared.mjs';

export default [
  ignoreConfig,
  createBrowserJsConfig(['frontend/**/*.{js,mjs,cjs}']),
  createNodeJsConfig(['*.{js,mjs,cjs}', '**/*.config.{js,mjs,cjs}', 'eslint/**/*.mjs']),
  createNodeTsConfig(['api/**/*.{ts,tsx}', 'iac/**/*.{ts,tsx}', 'packages/**/*.{ts,tsx}']),
  eslintConfigPrettier,
];
