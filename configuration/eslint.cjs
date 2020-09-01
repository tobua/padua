const { join } = require('path')

const defaultTSConfigurationPath = join(
  process.cwd(),
  'node_modules/padua/configuration/tsconfig.json'
)

module.exports = {
  extends: [
    'airbnb-typescript',
    'prettier',
    'prettier/react',
    'prettier/babel',
  ],
  rules: {
    'import/prefer-default-export': 0,
    'react/jsx-filename-extension': 0,
    'react/prop-types': 0,
  },
  ignorePatterns: ['dist', 'demo'],
  env: {
    browser: true,
  },
  parser: `@typescript-eslint/parser`,
  parserOptions: {
    project: defaultTSConfigurationPath,
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
