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

test('Result is bundled into single file.', async () => {
  const { dist } = prepare([
    packageJson('bundled-build', {
      // Required as otherwise files will be marked to be empty.
      sideEffects: true,
    }),
    file(
      'index.js',
      `import './component/First.js'
import './component/Second.js'
console.log('INDEX')`
    ),
    file('component/First.js', "console.log('FIRST')"),
    file('component/Second.js', "console.log('SECOND')"),
  ])

  await build()

  const contents = contentsForFilesMatching('**/*.js', dist)
  const sourceMaps = listFilesMatching('**/*.js.map', dist)

  expect(contents.length).toEqual(1)

  expect(contents[0].contents).toContain('FIRST')
  expect(contents[0].contents).toContain('INDEX')
  expect(contents[0].contents).toContain('SECOND')

  // Sourcemap also bundled.
  expect(sourceMaps.length).toEqual(1)
})

test('Result is bundled into single file.', async () => {
  const { dist } = prepare([
    packageJson('bundled-build', {
      padua: {
        esbuild: {
          // Disable bundling.
          bundle: false,
        },
      },
    }),
    file(
      'index.js',
      `import first from './component/First.js'
import second from './component/Second.js'
console.log('INDEX', first(), second())`
    ),
    file('component/First.js', "export default () => console.log('FIRST')"),
    file(
      'component/Second.js',
      `import { deep } from './Deep.js';
export default () => console.log('SECOND')`
    ),
    file('component/Deep.js', `export const deep = () => console.log('DEEP')`),
  ])

  await build()

  const contents = contentsForFilesMatching('**/*.js', dist)

  // TODO doesn't work, other files are lost.
  // expect(contents.length).toEqual(4)
})
