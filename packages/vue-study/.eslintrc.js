module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/typescript/recommended',
  ],
  parserOptions: {
    ecmaVersion: 'latest',
  },
  rules: {
    // 禁止使用分号
    'semi': ['error', 'never'],
    // 添加TypeScript分号规则
    '@typescript-eslint/semi': ['error', 'never'],
    // 允许在语句末尾使用逗号
    'comma-dangle': ['error', 'only-multiline'],
  },
}