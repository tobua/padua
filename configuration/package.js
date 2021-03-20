import { existsSync } from 'fs'
import { join } from 'path'
import get from 'lodash.get'
import set from 'lodash.set'
import unset from 'lodash.unset'
import { getOptions } from '../utility/options.js'
import { getProjectBasePath } from '../utility/path.js'

// Looks at the package contents to determine whether padua has already been setup
// with the initial() properties below.
const isInitial = (contents) => {
  if (
    typeof contents.prettier === 'string' &&
    contents.prettier.includes('padua')
  ) {
    return false
  }

  if (
    typeof contents.eslintConfig === 'object' &&
    typeof contents.eslintConfig.extends === 'string' &&
    contents.eslintConfig.extends.includes('padua')
  ) {
    return false
  }

  return true
}

// Basic properties only to be added on initial setup.
const initial = () => {
  const options = getOptions()

  const pkg = {
    sideEffects: false,
    type: 'module',
    files: [options.output],
    prettier: 'padua/configuration/.prettierrc.json',
    eslintConfig: {
      extends: './node_modules/padua/configuration/eslint.cjs',
    },
    engines: {
      node: '>= 14',
    },
  }

  if (options.test || !options.source) {
    pkg.scripts = {}
  }

  if (options.source) {
    pkg.files = ['**/*.js']

    if (existsSync(join(getProjectBasePath(), 'index.d.ts'))) {
      pkg.files.push('index.d.ts')
    }

    if (options.test) {
      pkg.files.push(`!${options.test}`)
    }
  }

  if (options.entry.length === 1 && options.source) {
    // eslint-disable-next-line prefer-destructuring
    pkg.source = options.entry[0]
  }

  return pkg
}

// Properties depending on project configurations that can change.
const switchable = (pkg) => {
  const options = getOptions()

  if (!pkg.scripts && (options.test || !options.source)) {
    pkg.scripts = {}
  }

  if (options.typescript) {
    pkg.types = `${options.output}/index.d.ts`
  } else if (
    options.source &&
    existsSync(join(getProjectBasePath(), 'index.d.ts'))
  ) {
    pkg.types = 'index.d.ts'
  } else if (pkg.types && !existsSync(join(getProjectBasePath(), pkg.types))) {
    delete pkg.types
  }

  if (options.source) {
    if (pkg.main && !existsSync(join(getProjectBasePath(), pkg.main))) {
      pkg.main = `${options.entry[0]}`
    }

    // Extensions required for node source code.
    set(pkg, 'eslintConfig.rules.import/extensions', [2, 'ignorePackages'])

    if (
      typeof get(pkg, 'scripts.start') === 'string' &&
      pkg.scripts.start.includes('padua')
    ) {
      delete pkg.scripts.start
    }

    if (
      typeof get(pkg, 'scripts.build') === 'string' &&
      pkg.scripts.build.includes('padua')
    ) {
      delete pkg.scripts.build
    }
  } else {
    if (!pkg.scripts.start && !pkg.scripts.build) {
      pkg.scripts.start = 'padua watch'
      pkg.scripts.build = 'padua build'
    }
    if (!pkg.main) {
      pkg.main = `${options.output}/index.js`
    }
  }

  if (options.test) {
    if (!pkg.scripts.test) {
      pkg.scripts.test = 'padua test'
    }

    if (!pkg.jest) {
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
  } else if (pkg.jest) {
    delete pkg.jest
  }
}

// Properties that will be updated if they are present, but contain outdated values.
export const update = (pkg) => {
  const init = initial()

  // Keep node version up-to-date.
  if (get(pkg, 'engines.node')) {
    pkg.engines.node = init.engines.node
  }

  // Old property no longer used.
  unset(pkg, 'jest.globals.ts-jest.tsConfig')

  // Value updated.
  if (get(pkg, 'eslintConfig.rules.import/extensions')) {
    pkg.eslintConfig.rules['import/extensions'] = [2, 'ignorePackages']
  }
}

export const packageJson = {
  isInitial,
  initial,
  update,
  switchable,
}
