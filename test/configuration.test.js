import { unlinkSync } from 'fs'
import { join } from 'path'
import {
  readFile,
  environment,
  prepare,
  file,
  packageJson,
  writeFile,
} from 'jest-fixture'
import { refresh } from '../utility/helper.js'
import { writeGitIgnore, writePackageJson } from '../utility/configuration.js'

environment('configuration')

beforeEach(refresh)

test('Generates gitignore with default entries.', () => {
  prepare([
    file('index.js', "console.log('gitignore')"),
    packageJson('gitignore'),
  ])

  writeGitIgnore([])

  const contents = readFile('.gitignore')

  expect(contents).toEqual(
    ['node_modules', 'package-lock.json', 'jsconfig.json', 'dist', ''].join(
      '\r\n'
    )
  )
})

test('Generates proper gitignore for typescript.', () => {
  prepare([
    packageJson('typescript'),
    file('index.ts', "console.log('typescript')"),
  ])

  writeGitIgnore([])

  const contents = readFile('.gitignore')

  expect(contents).toEqual(
    ['node_modules', 'package-lock.json', 'tsconfig.json', 'dist', ''].join(
      '\r\n'
    )
  )
})

test('No output folder when source mode active.', () => {
  prepare([
    packageJson('source', { padua: { source: true } }),
    file('index.js', "console.log('source')"),
  ])

  writeGitIgnore([])

  const contents = readFile('.gitignore')

  expect(contents).toEqual(
    ['node_modules', 'package-lock.json', 'jsconfig.json', ''].join('\r\n')
  )
})

test('Updates old package json properties.', () => {
  prepare([
    packageJson('outdated', {
      engines: { hello: 'world', node: '>= 13.2.0' },
    }),
    file('index.ts', "console.log('outdated')"),
  ])

  let pkg = readFile('package.json')

  expect(pkg.engines.node).toEqual('>= 13.2.0')

  writePackageJson()

  pkg = readFile('package.json')

  expect(pkg.engines.node).toEqual('>= 14')
})

test('Does not override configuration changes made by user after initial installation.', () => {
  prepare([
    packageJson('update', {
      license: 'UNLICENSED',
      sideEffects: true,
      scripts: {
        start: 'my-own-script',
      },
      prettier: 'padua/configuration/.prettierrc.json',
      eslintConfig: {
        extends: './node_modules/padua/configuration/eslint.cjs',
      },
    }),
    file('index.js', ''),
  ])

  writePackageJson()

  const pkg = readFile('package.json')

  expect(pkg.license).toBe('UNLICENSED')
  expect(pkg.sideEffects).toBe(true)
  expect(pkg.scripts.start).toBe('my-own-script')
  expect(pkg.type).toBe(undefined)
})

test('eslintConfig extended when switching to source mode.', () => {
  prepare([
    packageJson('source', {
      padua: {
        source: true,
      },
      type: 'classic',
      prettier: 'padua/configuration/.prettierrc.json',
      eslintConfig: {
        extends: './node_modules/padua/configuration/eslint.cjs',
      },
    }),
    file('index.js', ''),
  ])

  writePackageJson()

  const pkg = readFile('package.json')

  expect(pkg.eslintConfig.rules).toBeDefined()
  expect(pkg.type).toBe('classic')
})

test('Type definitions will be added in source mode as soon as available.', () => {
  prepare([
    packageJson('source', {
      padua: {
        source: true,
      },
      prettier: 'padua/configuration/.prettierrc.json',
      eslintConfig: {
        extends: './node_modules/padua/configuration/eslint.cjs',
      },
    }),
    file('index.js', ''),
  ])

  writePackageJson()

  let pkg = readFile('package.json')

  expect(pkg.types).not.toBeDefined()

  writeFile('index.d.ts', '')

  writePackageJson()

  pkg = readFile('package.json')

  expect(pkg.types).toBe('index.d.ts')

  unlinkSync(join(process.cwd(), 'index.d.ts'))

  writePackageJson()

  pkg = readFile('package.json')

  expect(pkg.types).not.toBeDefined()
})

test('Source entry will not be added again if removed by user.', () => {
  prepare([
    packageJson('source', {
      padua: {
        source: true,
      },
    }),
    file('index.js', ''),
  ])

  writePackageJson()

  let pkg = readFile('package.json')

  expect(pkg.source).toBeDefined()

  delete pkg.source

  writeFile('package.json', pkg)

  writePackageJson()

  pkg = readFile('package.json')

  expect(pkg.source).not.toBeDefined()
})

test('Files array is only changed initially.', () => {
  prepare([
    packageJson('source', {
      padua: {
        source: true,
        test: 'spec',
      },
    }),
    file('index.js', ''),
    file('spec/basic.test.js'),
  ])

  writePackageJson()

  let pkg = readFile('package.json')

  expect(pkg.files).toEqual(['**/*.js', '!spec'])

  pkg.files = ['1', '2', '3']

  writeFile('package.json', pkg)

  writePackageJson()

  pkg = readFile('package.json')

  expect(pkg.files).toEqual(['1', '2', '3'])
})

test('Test configuration static after initial write.', () => {
  prepare([
    packageJson('source', {
      padua: {
        source: true,
      },
    }),
    file('index.js', ''),
    file('test/basic.test.js'),
  ])

  writePackageJson()

  let pkg = readFile('package.json')

  expect(pkg.jest).toBeDefined()
  expect(pkg.jest.transform['^.+\\.jsx?$'].length).toBe(2)

  pkg.jest.modulePathIgnorePatterns = ['test/fixture']
  pkg.jest.transformIgnorePatterns = ['node_modules/cint']

  writeFile('package.json', pkg)

  writePackageJson()

  pkg = readFile('package.json')

  expect(pkg.jest).toBeDefined()
  expect(pkg.jest.transform['^.+\\.jsx?$'].length).toBe(2)
  expect(pkg.jest.modulePathIgnorePatterns).toBeDefined()
  expect(pkg.jest.transformIgnorePatterns).toBeDefined()
})

test('Stylelint configuration is added if dependency present and can be removed.', () => {
  prepare([
    packageJson('stylelint', {
      dependencies: {
        '@emotion/react': '11.4.0',
        react: '17.0.1',
      },
    }),
    file('index.js', ''),
  ])

  writePackageJson()

  let pkg = readFile('package.json')

  expect(pkg.stylelint).toBeDefined()
  expect(pkg.stylelint.extends).toBeDefined()

  pkg.dependencies = {}

  writeFile('package.json', pkg)

  refresh()

  writePackageJson()

  pkg = readFile('package.json')

  expect(pkg.stylelint).not.toBeDefined()
})

test('Stylelint works with several popular packages and can be overriden.', () => {
  prepare([
    packageJson('stylelint-override', {
      dependencies: {
        'styled-components': '11.4.0',
      },
    }),
    file('index.js', ''),
  ])

  writePackageJson()

  let pkg = readFile('package.json')

  expect(pkg.stylelint).toBeDefined()
  expect(pkg.stylelint.extends).toBeDefined()

  pkg.padua = {
    stylelint: false,
  }

  writeFile('package.json', pkg)

  refresh()

  writePackageJson()

  pkg = readFile('package.json')

  expect(pkg.stylelint).not.toBeDefined()
})
