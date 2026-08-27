import js from '@eslint/js'
import pluginVue from 'eslint-plugin-vue'
import globals from 'globals'
import prettierConfig from 'eslint-config-prettier'

export default [
  {
    ignores: ['dist/**', 'node_modules/**', '**/*.extracted.mjs'],
  },

  js.configs.recommended,
  ...pluginVue.configs['flat/essential'],

  {
    files: ['**/*.{js,mjs,vue}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
      },
    },
    rules: {
      eqeqeq: ['error', 'always'],
      'no-console': 'off',
      'no-unused-vars': 'warn',
      'no-empty': ['error', { allowEmptyCatch: true }],
      'vue/multi-word-component-names': 'off',
    },
  },

  {
    files: ['vite.config.js', 'server/**/*.js', 'api/**/*.js'],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },

  prettierConfig,
]
