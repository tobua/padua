import { join } from 'path'
import { getOptions } from '../utility/options.js'
import { refresh } from '../utility/helper.js'

const CWD = process.cwd()
const cwdSpy = jest.spyOn(process, 'cwd')

beforeEach(() => refresh())

test('Additional entry plus default entries are added.', () => {
  const fixturePath = join(CWD, 'test/fixture/entry')
  cwdSpy.mockReturnValue(fixturePath)

  const options = getOptions()

  expect(typeof options).toEqual('object')
  expect(options.typescript).toEqual(true)
  expect(options.react).toEqual(true)
  expect(options.entry).toEqual(['hello.js', 'src/index.tsx'])
})

test('TS and React options not set for JavaScript file.', () => {
  const fixturePath = join(CWD, 'test/fixture/source')
  cwdSpy.mockReturnValue(fixturePath)

  const options = getOptions()

  expect(typeof options).toEqual('object')
  expect(options.typescript).toEqual(false)
  expect(options.react).toEqual(false)
  expect(options.entry).toEqual(['index.js'])
})
