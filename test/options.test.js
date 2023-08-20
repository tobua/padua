import { environment, prepare, packageJson, file, registerVitest } from 'jest-fixture'
import { test, expect, beforeEach, afterEach, vi } from 'vitest'
import { refresh } from '../utility/helper.js'
import { getOptions } from '../utility/options.js'

registerVitest(beforeEach, afterEach, vi)

environment('options')

beforeEach(refresh)

test('Additional entry plus default entries are added.', () => {
  prepare([
    packageJson('entry', { padua: { entry: 'hello.js' } }),
    file('src/index.tsx', "console.log('what typescript?')"),
    file('hello.js', "console.log('hello')"),
  ])

  const options = getOptions()

  expect(typeof options).toEqual('object')
  expect(options.typescript).toEqual(true)
  expect(options.react).toEqual(true)
  expect(options.entry).toEqual(['hello.js', 'src/index.tsx'])
  expect(options.stylelint).toEqual(undefined)
})

test('TS and React options not set for JavaScript file.', () => {
  prepare([
    packageJson('source', { padua: { source: true } }),
    file('index.js', "console.log('source')"),
  ])

  const options = getOptions()

  expect(typeof options).toEqual('object')
  expect(options.typescript).toEqual(false)
  expect(options.react).toEqual(false)
  expect(options.entry).toEqual(['index.js'])
})

test('Multiple entries can be added.', () => {
  prepare([
    packageJson('entry', { padua: { entry: ['first.js', 'second.js'] } }),
    file('first.js', ''),
    file('second.js', ''),
  ])

  const options = getOptions()

  expect(options.entry).toEqual(['first.js', 'second.js'])
})

test('Index entry is added automatically.', () => {
  prepare([
    packageJson('entry', { padua: { entry: ['first.js'] } }),
    file('first.js', ''),
    file('index.js', ''),
  ])

  const options = getOptions()

  expect(options.entry).toEqual(['first.js', 'index.js'])
})

test('Duplicates will be removed.', () => {
  prepare([
    packageJson('entry', {
      padua: { entry: ['first.js', 'index.js', './first.js'] },
    }),
    file('first.js', ''),
    file('index.js', ''),
  ])

  const options = getOptions()

  expect(options.entry).toEqual(['first.js', 'index.js'])
})

test('Entries can contain globs from root with file extension.', () => {
  prepare([
    packageJson('entry', { padua: { entry: ['*.js'] } }),
    file('index.js', ''),
    file('something.js', ''),
    file('whaaat.ts', ''),
  ])

  const options = getOptions()

  expect(options.entry).toEqual(['index.js', 'something.js'])
})

test('Entries can contain globs.', () => {
  prepare([
    packageJson('entry', { padua: { entry: ['theme/*'] } }),
    file('index.js', ''),
    file('theme/first.js', ''),
    file('theme/second.js', ''),
    file('theme/third-fourth.js', ''),
    file('theme/nested/missing.js', ''),
  ])

  const options = getOptions()

  expect(options.entry).toEqual([
    'theme/first.js',
    'theme/second.js',
    'theme/third-fourth.js',
    'index.js',
  ])
})

test('Nested globs are possible.', () => {
  prepare([
    packageJson('entry', { padua: { entry: ['theme/**/*.js'] } }),
    file('theme/first.js', ''),
    file('theme/nested/second.js', ''),
    file('theme/nested/deeper/third-fourth.js', ''),
  ])

  const options = getOptions()

  expect(options.entry).toEqual([
    'theme/first.js',
    'theme/nested/second.js',
    'theme/nested/deeper/third-fourth.js',
  ])
})

test('Stylelint can be turned on.', () => {
  prepare([packageJson('stylelint', { padua: { stylelint: true } }), file('first.js', '')])

  const options = getOptions()

  expect(options.stylelint).toEqual(true)
})
