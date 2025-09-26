/* eslint config for mono-repo with a11y rules */
module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint','react','jsx-a11y'],
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:jsx-a11y/recommended'
  ],
  settings: { react: { version: 'detect' } },
  rules: {
    'no-restricted-imports': ['error', {
  'patterns': ['app/*', 'services/*']
}],

    'react/jsx-key': 'warn',
    'react/prop-types': 'off',
    'jsx-a11y/anchor-is-valid': 'warn',
    'jsx-a11y/alt-text': 'error',
    'jsx-a11y/no-autofocus': 'warn'
  },
  ignorePatterns: ['**/dist/**','**/.next/**','**/node_modules/**']
};
