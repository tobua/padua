import { environment, prepare } from './utility/prepare.js'
import { getOptions } from '../utility/options.js'

const [fixturePath] = environment('options')

test('Additional entry plus default entries are added.', () => {
  prepare('entry', fixturePath)

  const options = getOptions()

  expect(typeof options).toEqual('object')
  expect(options.typescript).toEqual(true)
  expect(options.react).toEqual(true)
  expect(options.entry).toEqual(['hello.js', 'src/index.tsx'])
})

test('TS and React options not set for JavaScript file.', () => {
  prepare('source', fixturePath)

  const options = getOptions()

  expect(typeof options).toEqual('object')
  expect(options.typescript).toEqual(false)
  expect(options.react).toEqual(false)
  expect(options.entry).toEqual(['index.js'])
})
