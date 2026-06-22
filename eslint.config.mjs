import eslintConfigPrettier from 'eslint-config-prettier';
import {
  createBrowserJsConfig,
  createNodeJsConfig,
  createNodeTsConfig,
  ignoreConfig,
} from './packages/eslint-config/shared.mjs';

export default [
  ignoreConfig,
  createBrowserJsConfig(['frontend/**/*.{js,mjs,cjs}']),
  createNodeJsConfig([
    '*.{js,mjs,cjs}',
    '**/*.config.{js,mjs,cjs}',
    'packages/eslint-config/**/*.mjs',
  ]),
  createNodeTsConfig(['api/**/*.{ts,tsx}', 'iac/**/*.{ts,tsx}', 'packages/**/*.{ts,tsx}']),
  eslintConfigPrettier,
];
