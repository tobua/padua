import { readFile, environment, prepare, file, packageJson, registerVitest } from 'jest-fixture'
import { test, expect, beforeEach, afterEach, vi } from 'vitest'
import { refresh } from '../utility/helper.js'
import { writePackageJson } from '../utility/configuration.js'

registerVitest(beforeEach, afterEach, vi)

environment('configuration')

beforeEach(refresh)

// is-ci mocked as true for this test!
vi.mock('is-ci', () => ({ default: true }))

test('Will always add configuration to fresh templates.', async () => {
  prepare([
    packageJson('template', {
      scripts: {
        build: 'sth else',
      },
    }),
    file('index.js', ''),
  ])

  await writePackageJson()

  const pkg = readFile('package.json')

  expect(pkg.scripts.build).toBe('sth else')
  expect(pkg.type).toBe('module')
})

test('CI and presence of license field will no longer touch package proeprties.', async () => {
  prepare([
    packageJson('template', {
      license: 'MIT',
    }),
    file('index.js', ''),
  ])

  await writePackageJson()

  const pkg = readFile('package.json')

  expect(pkg.license).toBe('MIT')
  expect(pkg.type).not.toBe('module')
})
