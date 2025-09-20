import js from '@eslint/js';
import typescript from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';
import vue from 'eslint-plugin-vue';
import vueParser from 'vue-eslint-parser';
import prettierConfig from 'eslint-config-prettier';

export default [
  {
    ignores: [
      'dist/**',
      'src-capacitor/**',
      'src-cordova/**',
      '.quasar/**',
      'node_modules/**',
      'src-ssr/**',
    ],
  },
  js.configs.recommended,
  ...vue.configs['flat/essential'],
  ...vue.configs['flat/strongly-recommended'],
  {
    files: ['**/*.{js,ts,vue}'],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: typescriptParser,
        extraFileExtensions: ['.vue'],
        ecmaVersion: 2022,
        sourceType: 'module',
      },
      globals: {
        ga: 'readonly',
        cordova: 'readonly',
        __statics: 'readonly',
        __QUASAR_SSR__: 'readonly',
        __QUASAR_SSR_SERVER__: 'readonly',
        __QUASAR_SSR_CLIENT__: 'readonly',
        __QUASAR_SSR_PWA__: 'readonly',
        process: 'readonly',
        Capacitor: 'readonly',
        chrome: 'readonly',
        console: 'readonly',
        window: 'readonly',
        document: 'readonly',
        structuredClone: 'readonly',
        Buffer: 'readonly',
        URL: 'readonly',
        location: 'readonly',
        ServiceWorkerGlobalScope: 'readonly',
      },
    },
    plugins: {
      '@typescript-eslint': typescript,
      vue,
    },
    rules: {
      'prefer-promise-reject-errors': 'off',
      quotes: ['warn', 'single', { avoidEscape: true }],
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-var-requires': 'off',
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_' },
      ],
      'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
      'vue/multi-word-component-names': 'off',
      'no-case-declarations': 'error',
    },
  },
  prettierConfig,
  {
    files: ['**/*.ts', '**/*.tsx'],
    rules: {
      ...typescript.configs.recommended.rules,
    },
  },
  {
    files: ['**/*.cjs', '**/.eslintrc.js'],
    languageOptions: {
      sourceType: 'commonjs',
      globals: {
        module: 'readonly',
        require: 'readonly',
        __dirname: 'readonly',
      },
    },
  },
  {
    files: ['quasar.config.js'],
    languageOptions: {
      globals: {
        __dirname: 'readonly',
      },
    },
  },
  {
    files: ['**/*.cy.ts', '**/test/**/*.ts'],
    languageOptions: {
      globals: {
        describe: 'readonly',
        it: 'readonly',
        cy: 'readonly',
        context: 'readonly',
        beforeEach: 'readonly',
      },
    },
  },
];
