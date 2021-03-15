import { environment, prepare, packageJson, file } from 'jest-fixture'
import { refresh } from '../utility/helper.js'
import { getOptions } from '../utility/options.js'

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
