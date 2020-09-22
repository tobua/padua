import { getOptions } from '../utility/options'

export const packageJson = () => {
  const options = getOptions()
  const pkg = {
    engines: {
      node: '>= 13.2.0',
    },
    prettier: 'padua/configuration/.prettierrc.json',
    eslintConfig: {
      extends: './node_modules/padua/configuration/eslint.cjs',
    },
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
          tsConfig: './node_modules/padua/configuration/tsconfig.json',
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
    pkg.files = ['**/*.js']
    pkg.main = `${options.entry}`
  } else {
    pkg.scripts.start = 'padua watch'
    pkg.main = `${options.output}/index.js`
  }

  if (options.entry) {
    pkg.source = options.entry
  }

  return pkg
}
