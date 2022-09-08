module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
  },
  extends: ['airbnb-base'],
  parserOptions: {
    ecmaVersion: 13,
  },
  rules: {
    'no-console': 0,
    'linebreak-style': 0,
    'no-unused-vars': 'warn',
    'no-plusplus': 0,
    'no-underscore-dangle': ['error', { allow: ['_id'] }],
  },
};
