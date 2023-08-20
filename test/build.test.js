import {
  environment,
  prepare,
  packageJson,
  file,
  listFilesMatching,
  contentsForFilesMatching,
  writeFile,
  wait,
  registerVitest,
} from 'jest-fixture'
import { test, expect, beforeEach, afterEach, vi } from 'vitest'
import { refresh } from '../utility/helper.js'
import { build, watch } from '../index.js'

registerVitest(beforeEach, afterEach, vi)

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

test('Bundling can "not" be disabled.', async () => {
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
      `import first from './first.js'
import second from './component/second.js'
console.log('INDEX', first(), second())`
    ),
    file('first.js', "export default () => console.log('FIRST')"),
    file(
      'component/second.js',
      `import { deep } from './deep.js';
export default () => console.log('SECOND')`
    ),
    file('component/deep.js', `export const deep = () => console.log('DEEP')`),
  ])

  await build()

  // See https://github.com/evanw/esbuild/issues/944 esbuild can only be used with bundle: true.
  const contents = contentsForFilesMatching('**/*.js', dist)

  expect(contents.length).toEqual(1)
  expect(contents[0].contents).toContain('INDEX')
  expect(contents[0].contents).not.toContain('FIRST')
  expect(contents[0].contents).not.toContain('SECOND')
  expect(contents[0].contents).not.toContain('DEEP')
})

test('Can bundle TypeScript.', async () => {
  const { dist } = prepare([
    packageJson('typescript-build', {
      // Required as otherwise files will be marked to be empty.
      sideEffects: true,
    }),
    file(
      'index.ts',
      `import './other.js'
console.log('INDEX' as string)`
    ),
    file('other.js', "console.log('OTHER')"),
  ])

  await build()

  const contents = contentsForFilesMatching('**/*.js', dist)
  const sourceMaps = listFilesMatching('**/*.js.map', dist)

  expect(contents.length).toEqual(1)
  expect(contents[0].contents).toContain('INDEX')
  expect(contents[0].contents).toContain('OTHER')
  expect(contents[0].contents).not.toContain('as string')

  // Sourcemap also bundled.
  expect(sourceMaps.length).toEqual(1)
})

test('Watches for changes.', async () => {
  const { dist } = prepare([
    packageJson('watch-build', {
      // Required as otherwise files will be marked to be empty.
      sideEffects: true,
    }),
    file('index.js', `console.log('INDEX')`),
  ])

  const stop = await watch()

  let contents = contentsForFilesMatching('**/*.js', dist)

  expect(contents.length).toEqual(1)
  expect(contents[0].contents).toContain('INDEX')

  writeFile('index.js', `console.log('CHANGED')`)

  await wait(0.5)

  contents = contentsForFilesMatching('**/*.js', dist)

  expect(contents.length).toEqual(1)
  expect(contents[0].contents).toContain('CHANGED')

  await stop()
})

test('Can build for node as a target.', async () => {
  const { dist } = prepare([
    packageJson('nodebuild', {
      // target: esnext required for top-level await (node >= 14, ES2022)
      padua: { esbuild: { platform: 'node', format: 'esm', target: 'esnext' } },
    }),
    file(
      'index.js',
      "import { readFileSync } from 'fs'; import { join } from 'path'; console.log('INDEX', readFileSync, join, process.env, await new Promise(done => { setTimeout(done, 1) }))"
    ),
  ])

  await build()

  const jsContents = contentsForFilesMatching('*.js', dist)[0].contents

  expect(jsContents).toContain('INDEX')
  expect(jsContents).toContain('join')
  expect(jsContents).toContain('readFileSync')
})
