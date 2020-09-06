export default {
  main: 'dist/index.js',
  source: 'index.ts',
  types: 'dist/index.d.ts',
  engines: {
    node: '>= 13.2.0',
  },
  scripts: {
    start: 'padua watch',
    test: 'padua test',
  },
  prettier: 'padua/configuration/.prettierrc.json',
  eslintConfig: {
    extends: './node_modules/padua/configuration/eslint.cjs',
  },
  jest: {
    transform: {
      '^.+\\.tsx?$': 'ts-jest',
      '^.+\\.jsx?$': [
        'babel-jest',
        { configFile: './node_modules/padua/configuration/.babelrc' },
      ],
    },
    globals: {
      'ts-jest': {
        tsConfig: './node_modules/padua/configuration/tsconfig.json',
      },
    },
  },
  files: ['dist'],
}
