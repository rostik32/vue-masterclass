/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution');

module.exports = {
  root: true,
  extends: ['plugin:vue/vue3-recommended', 'eslint:recommended', '@vue/eslint-config-prettier'],
  parserOptions: {
    ecmaVersion: 'latest',
  },
  rules: {
    'vue/no-deprecated-v-on-number-modifiers': 'warn',
    'max-len': [1, { code: 100 }],
    'prettier/prettier': [
      'error',
      {
        printWidth: 100,
      },
    ],
  },
};
