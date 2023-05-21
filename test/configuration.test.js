import { unlinkSync } from 'fs'
import { join } from 'path'
import {
  readFile,
  environment,
  prepare,
  file,
  packageJson,
  writeFile,
  contentsForFilesMatching,
} from 'jest-fixture'
import { refresh } from '../utility/helper.js'
import { writeGitIgnore, writePackageJson, writeIgnore } from '../utility/configuration.js'

environment('configuration')

beforeEach(refresh)

test('Generates gitignore with default entries.', () => {
  prepare([file('index.js', "console.log('gitignore')"), packageJson('gitignore')])

  writeGitIgnore([])

  const contents = readFile('.gitignore')

  expect(contents).toEqual(
    ['node_modules', 'package-lock.json', 'jsconfig.json', 'dist', ''].join('\r\n')
  )
})

test('Generates proper gitignore for typescript.', () => {
  prepare([packageJson('typescript'), file('index.ts', "console.log('typescript')")])

  writeGitIgnore([])

  const contents = readFile('.gitignore')

  expect(contents).toEqual(
    ['node_modules', 'package-lock.json', 'tsconfig.json', 'dist', ''].join('\r\n')
  )
})

test('No output folder when source mode active.', () => {
  prepare([
    packageJson('source', { padua: { source: true } }),
    file('index.js', "console.log('source')"),
  ])

  writeGitIgnore([])

  const contents = readFile('.gitignore')

  expect(contents).toEqual(['node_modules', 'package-lock.json', 'jsconfig.json', ''].join('\r\n'))
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

  expect(pkg.engines.node).toEqual('>= 16')
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

test('No jest configuration added if vitest installed.', () => {
  prepare([
    packageJson('source', {
      dependencies: {
        vitest: 'latest',
      },
    }),
    file('index.ts', ''),
    file('test/basic.test.ts'),
  ])

  writePackageJson()

  const pkg = readFile('package.json')

  expect(pkg.jest).not.toBeDefined()
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

test('Ignores are written to all configuration files.', () => {
  const ignores = [
    'demo',
    'documentation',
    { name: 'index.d.ts', test: false },
    { name: 'test/fixture', lint: false },
  ]

  const { dist } = prepare([
    packageJson('ignores', {
      padua: {
        ignore: ignores,
      },
    }),
    file('index.js', ''),
    file('test/basic.test.js', ''),
    file(
      'node_modules/padua/configuration/.prettierignore',
      readFile('../../../configuration/.prettierignore')
    ),
    file(
      'node_modules/padua/configuration/eslint.cjs',
      readFile('../../../configuration/eslint.cjs')
    ),
    file(
      'node_modules/padua/configuration/stylelint.cjs',
      readFile('../../../configuration/stylelint.cjs')
    ),
  ])

  writePackageJson()
  writeIgnore(ignores)

  const configurationFolder = join(dist, '..', 'node_modules/padua/configuration')

  let files = contentsForFilesMatching('*', configurationFolder)

  expect(files.length).toBe(3)

  let prettierContents = files[0].contents
  let eslintContents = files[1].contents
  let stylelintContents = files[2].contents

  let lintFiles = ['dist', 'node_modules', ignores[0], ignores[1], ignores[2].name]

  expect(prettierContents).toEqual(lintFiles.join('\n'))
  expect(eslintContents).toContain(lintFiles.map((item) => `'${item}'`).join(', '))
  expect(stylelintContents).toContain(lintFiles.map((item) => `'${item}'`).join(', '))

  let packageJsonContents = readFile('package.json')

  expect(packageJsonContents.jest.testPathIgnorePatterns).toEqual([
    'demo',
    'documentation',
    'test/fixture',
  ])

  // Result stays the same after multiple writes.
  writePackageJson()
  writeIgnore(ignores)

  files = contentsForFilesMatching('*', configurationFolder)

  expect(files.length).toBe(3)

  prettierContents = files[0].contents
  eslintContents = files[1].contents
  stylelintContents = files[2].contents

  expect(prettierContents).toEqual(lintFiles.join('\n'))
  expect(eslintContents).toContain(lintFiles.map((item) => `'${item}'`).join(', '))
  expect(stylelintContents).toContain(lintFiles.map((item) => `'${item}'`).join(', '))

  packageJsonContents = readFile('package.json')

  expect(packageJsonContents.jest.testPathIgnorePatterns).toEqual([
    'demo',
    'documentation',
    'test/fixture',
  ])

  // Old values gone when missing in new configuration.
  writePackageJson()
  writeIgnore([ignores[0]])

  lintFiles = ['dist', 'node_modules', ignores[0]]

  files = contentsForFilesMatching('*', configurationFolder)

  expect(files.length).toBe(3)

  prettierContents = files[0].contents
  eslintContents = files[1].contents
  stylelintContents = files[2].contents

  expect(prettierContents).toEqual(lintFiles.join('\n'))
  expect(eslintContents).toContain(lintFiles.map((item) => `'${item}'`).join(', '))
  expect(stylelintContents).toContain(lintFiles.map((item) => `'${item}'`).join(', '))

  packageJsonContents = readFile('package.json')

  // Old values stay, so that user changes made to package.json don't get overridden.
  expect(packageJsonContents.jest.testPathIgnorePatterns).toEqual([
    'documentation',
    'test/fixture',
    'demo',
  ])
})

test('Proper ignores added when values are empty.', () => {
  const { dist } = prepare([
    packageJson('ignore-empty', {
      padua: {
        output: 'public/dist',
      },
    }),
    file('index.js', ''),
    file('test/basic.test.js', ''),
    file(
      'node_modules/padua/configuration/.prettierignore',
      readFile('../../../configuration/.prettierignore')
    ),
    file(
      'node_modules/padua/configuration/eslint.cjs',
      readFile('../../../configuration/eslint.cjs')
    ),
    file(
      'node_modules/padua/configuration/stylelint.cjs',
      readFile('../../../configuration/stylelint.cjs')
    ),
  ])

  writePackageJson()
  writeIgnore(undefined)

  const configurationFolder = join(dist, '..', 'node_modules/padua/configuration')

  const files = contentsForFilesMatching('*', configurationFolder)

  expect(files.length).toBe(3)

  const prettierContents = files[0].contents
  const eslintContents = files[1].contents
  const stylelintContents = files[2].contents

  const lintFiles = ['public/dist', 'node_modules']

  expect(prettierContents).toEqual(lintFiles.join('\n'))
  expect(eslintContents).toContain(lintFiles.map((item) => `'${item}'`).join(', '))
  expect(stylelintContents).toContain(lintFiles.map((item) => `'${item}'`).join(', '))

  const packageJsonContents = readFile('package.json')

  expect(packageJsonContents.jest.testPathIgnorePatterns).toBeUndefined()
})

test('Ignores work with all possible configurations.', () => {
  const ignores = [
    { name: 'empty', test: false, lint: false },
    { name: 'lint', test: false },
    { name: 'test', lint: false },
    { name: 'all', lint: true, test: true },
  ]

  const { dist } = prepare([
    packageJson('various-ignores', {
      padua: {
        ignore: ignores,
      },
    }),
    file('index.js', ''),
    file('test/basic.test.js', ''),
    file(
      'node_modules/padua/configuration/.prettierignore',
      readFile('../../../configuration/.prettierignore')
    ),
    file(
      'node_modules/padua/configuration/eslint.cjs',
      readFile('../../../configuration/eslint.cjs')
    ),
    file(
      'node_modules/padua/configuration/stylelint.cjs',
      readFile('../../../configuration/stylelint.cjs')
    ),
  ])

  writePackageJson()
  writeIgnore(ignores)

  const configurationFolder = join(dist, '..', 'node_modules/padua/configuration')

  const files = contentsForFilesMatching('*', configurationFolder)

  expect(files.length).toBe(3)

  const prettierContents = files[0].contents
  const eslintContents = files[1].contents
  const stylelintContents = files[2].contents

  const lintFiles = ['dist', 'node_modules', ignores[1].name, ignores[3].name]

  expect(prettierContents).toEqual(lintFiles.join('\n'))
  expect(eslintContents).toContain(lintFiles.map((item) => `'${item}'`).join(', '))
  expect(stylelintContents).toContain(lintFiles.map((item) => `'${item}'`).join(', '))

  const packageJsonContents = readFile('package.json')

  expect(packageJsonContents.jest.testPathIgnorePatterns).toEqual([
    ignores[2].name,
    ignores[3].name,
  ])
})
