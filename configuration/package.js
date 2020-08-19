export default {
  main: 'dist/index.js',
  source: 'index.ts',
  types: 'dist/index.d.ts',
  engines: {
    node: '>= 13.2.0',
  },
  scripts: {
    watch: 'padua watch',
    build: 'padua build',
    lint: 'padua lint',
    test: 'padua test',
    publish: 'padua publish',
    update: 'padua update',
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
