export default {
  main: 'dist/index.js',
  source: 'index.ts',
  typings: 'dist/index.d.ts',
  engines: {
    node: '>= 13.2.0',
  },
  scripts: {
    watch: 'padua watch',
    build: 'padua build',
    lint: 'padua lint',
    test: 'padua test',
    publish: 'padua publish',
  },
  prettier: 'padua/configuration/.prettierrc.json',
  eslintConfig: {
    extends: './node_modules/padua/configuration/eslint.cjs',
  },
  jest: {
    transform: {
      '^.+\\.tsx?$': 'ts-jest',
    },
    globals: {
      'ts-jest': {
        tsConfig: './node_modules/padua/configuration/tsconfig.json',
      },
    },
  },
  files: ['dist'],
}
