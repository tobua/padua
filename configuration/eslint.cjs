module.exports = {
  extends: ['airbnb', 'prettier', 'prettier/react', 'prettier/babel'],
  rules: {
    'import/prefer-default-export': 0,
    'react/jsx-filename-extension': 0,
    'react/prop-types': 0,
  },
  ignorePatterns: ['dist', 'demo'],
  env: {
    browser: true,
  },
  parser: 'babel-eslint',
  settings: {
    'import/resolver': {
      node: {
        paths: ['.'],
      },
    },
  },
  overrides: [
    {
      files: ['**/*.test.js'],
      env: {
        jest: true,
      },
    },
  ],
}
