import {
  environment,
  prepare,
  packageJson,
  file,
  listFilesMatching,
  contentsForFilesMatching,
} from 'jest-fixture'
import { refresh } from '../utility/helper.js'
import { build } from '../index.js'

environment('build')

beforeEach(refresh)

test('Build generates output for multiple entries.', async () => {
  const { dist } = prepare([
    packageJson('multiple-entry-build', {
      padua: { entry: ['first.js', 'second.js'] },
    }),
    file('index.js', "console.log('INDEX')"),
    file('first.js', "console.log('FIRST')"),
    file('second.js', "console.log('SECOND')"),
  ])

  await build()

  const contents = contentsForFilesMatching('*.js', dist)

  expect(contents.length).toEqual(3)

  expect(contents[0].contents).toContain('FIRST')
  expect(contents[1].contents).toContain('INDEX')
  expect(contents[2].contents).toContain('SECOND')

  const sourceMaps = listFilesMatching('*.js.map', dist)

  // Each output file is accompanied by a source-map.
  expect(sourceMaps.length).toEqual(3)
})
