const customRules = {
  // Use named exports to make it easier to find usages.
  'import/prefer-default-export': 0,
  // JSX can also be written in JS files but not in TS (build error).
  'react/jsx-filename-extension': 0,
  // No line required between mobx observable properties.
  'lines-between-class-members': 0,
  '@typescript-eslint/lines-between-class-members': 0,
  // Multiple mobx classes per file, especially for lists.
  'max-classes-per-file': 0,
  // Allow spreading props.
  'react/jsx-props-no-spreading': 0,
  // Props defined with TS which will not be linted.
  'react/require-default-props': 0,
  // Often there is only the index available, would make plugin API more complex otherwise.
  'react/no-array-index-key': 0,
}

const customSettings = {
  'import/extensions': ['.js', '.jsx', '.ts', '.tsx'],
}

// CJS for backwards compatibility.
module.exports = {
  extends: ['airbnb', 'prettier', 'prettier/react', 'prettier/babel'],
  rules: customRules,
  ignorePatterns: ['dist', 'demo'],
  env: {
    browser: true,
    node: true,
  },
  parser: 'babel-eslint',
  settings: customSettings,
  overrides: [
    {
      // Tests
      files: ['**/*.test.js', '**/*.test.ts'],
      settings: customSettings,
      env: {
        jest: true,
      },
    },
    {
      // TypeScript
      files: ['**/*.ts', '**/*.tsx'],
      extends: [
        'airbnb-typescript',
        'prettier',
        'prettier/react',
        'prettier/@typescript-eslint',
      ],
      rules: customRules,
      settings: customSettings,
      parser: '@typescript-eslint/parser',
      parserOptions: {
        // extends user configuration adding in /test folder so it can be linted, but
        // will not be included in the build.
        project: './node_modules/padua/configuration/tsconfig-eslint.json',
      },
    },
  ],
}
