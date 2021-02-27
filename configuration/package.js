import { getOptions } from '../utility/options.js'

// Old package properties users might have that should be deleted or updated.
export const packagePropertiesToUpdate = [
  // Keep node version up-to-date.
  'engines',
  // Old property no longer used.
  'jest.globals.ts-jest.tsConfig',
  // Value updated.
  'eslintConfig.rules.import/extensions',
]

export const packageJson = () => {
  const options = getOptions()
  const pkg = {
    engines: {
      node: '>= 14',
    },
    prettier: 'padua/configuration/.prettierrc.json',
    eslintConfig: {
      extends: './node_modules/padua/configuration/eslint.cjs',
    },
    sideEffects: false,
    files: [options.output],
  }

  if (options.test || !options.source) {
    pkg.scripts = {}
  }

  if (options.test) {
    pkg.scripts.test = 'padua test'
    pkg.jest = {
      transform: {},
    }

    if (options.typescript) {
      pkg.jest.transform['^.+\\.tsx?$'] = 'ts-jest'
      pkg.jest.globals = {
        'ts-jest': {
          tsconfig: './tsconfig.json',
        },
      }
    } else {
      pkg.jest.transform['^.+\\.jsx?$'] = [
        'babel-jest',
        { configFile: './node_modules/padua/configuration/.babelrc' },
      ]
    }
  }

  if (options.typescript) {
    pkg.types = `${options.output}/index.d.ts`
  } else if (options.source) {
    pkg.types = 'index.d.ts'
  }

  if (options.source) {
    pkg.files = ['**/*.js', 'index.d.ts']
    if (options.test) {
      pkg.files.push('!test')
    }
    pkg.main = `${options.entry}`
    // Extensions required for node source code.
    pkg.eslintConfig.rules = {
      'import/extensions': [2, 'ignorePackages'],
    }
  } else {
    pkg.scripts.start = 'padua watch'
    pkg.scripts.build = 'padua build'
    pkg.main = `${options.output}/index.js`
  }

  if (options.entry) {
    // eslint-disable-next-line prefer-destructuring
    pkg.source = options.entry[0]
  }

  return pkg
}
