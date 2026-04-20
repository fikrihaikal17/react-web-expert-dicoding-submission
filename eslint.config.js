import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';
import globals from 'globals';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import { defineConfig, globalIgnores } from 'eslint/config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({ baseDirectory: __dirname });
const googleStyleGuide = compat.extends('google').map((config) => {
  if (!config.rules) {
    return config;
  }

  const rules = Object.fromEntries(
    Object.entries(config.rules).filter(([ruleName]) => (
      ruleName !== 'valid-jsdoc' && ruleName !== 'require-jsdoc'
    )),
  );

  return {
    ...config,
    rules,
  };
});

export default defineConfig([
  globalIgnores(['dist']),
  ...googleStyleGuide,
  {
    files: ['**/*.{js,jsx,cjs}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    rules: {
      'linebreak-style': 'off',
      'object-curly-spacing': 'off',
      'indent': 'off',
      'max-len': 'off',
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
    },
  },
  {
    files: ['**/*.cjs'],
    languageOptions: {
      sourceType: 'commonjs',
    },
  },
  {
    files: ['**/__tests__/**/*.{js,jsx}', '**/*.test.{js,jsx}', 'jest.setup.js'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.jest,
      },
    },
  },
  {
    files: ['cypress.config.js', 'cypress/**/*.{js,jsx}'],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals['shared-node-browser'],
        ...globals.mocha,
        cy: 'readonly',
        Cypress: 'readonly',
        expect: 'readonly',
        assert: 'readonly',
        chai: 'readonly',
      },
    },
  },
]);
