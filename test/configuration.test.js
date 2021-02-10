import { readFile } from './utility/file.js'
import { environment, prepare } from './utility/prepare.js'
import { writeGitIgnore, writePackageJson } from '../utility/configuration.js'

const [fixturePath] = environment('configuration')

test('Generates gitignore with default entries.', () => {
  prepare('gitignore', fixturePath)

  writeGitIgnore([])

  const contents = readFile('.gitignore')

  expect(contents).toEqual(
    ['node_modules', 'package-lock.json', 'jsconfig.json', 'dist', ''].join(
      '\r\n'
    )
  )
})

test('Generates proper gitignore for typescript.', () => {
  prepare('typescript', fixturePath)

  writeGitIgnore([])

  const contents = readFile('.gitignore')

  expect(contents).toEqual(
    ['node_modules', 'package-lock.json', 'tsconfig.json', 'dist', ''].join(
      '\r\n'
    )
  )
})

test('No output folder when source mode active.', () => {
  prepare('source', fixturePath)

  writeGitIgnore([])

  const contents = readFile('.gitignore')

  expect(contents).toEqual(
    ['node_modules', 'package-lock.json', 'jsconfig.json', ''].join('\r\n')
  )
})

test('Updates old package json properties.', () => {
  prepare('outdated', fixturePath)

  let pkg = readFile('package.json')

  expect(pkg.engines.node).toEqual('>= 13.2.0')

  writePackageJson()

  pkg = readFile('package.json')

  expect(pkg.engines.node).toEqual('>= 14')
})
