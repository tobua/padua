import { readFile, environment, prepare, file, packageJson } from 'jest-fixture'
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
