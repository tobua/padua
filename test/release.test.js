import { execSync } from 'child_process'
import isCI from 'is-ci'
import pacote from 'pacote'
import { environment, prepare, packageJson, file, registerVitest } from 'jest-fixture'
import { test, expect, beforeEach, afterEach, vi } from 'vitest'
import { refresh } from '../utility/helper.js'
import { checkOwner, firstRelease, validatePackage, releaseAs } from '../script/release.js'

registerVitest(beforeEach, afterEach, vi)

environment('release')

beforeEach(refresh)

const mockExit = jest.spyOn(process, 'exit').mockImplementation(() => {})

const userLoggedIn = () => {
  try {
    execSync('npm whoami')
  } catch (error) {
    return false
  }

  return true
}

test('Check if the package owner matches the logged in user.', () => {
  if (!isCI && userLoggedIn()) {
    expect(checkOwner({ pkg: { name: 'padua' } })).toBe(true)
    expect(checkOwner({ pkg: { name: 'react' } })).toBe(false)
  }
})

test("Checks if the package isn't yet released.", async () => {
  prepare([
    packageJson('first-release'),
    file('index.js', "console.log('released')"),
    file('CHANGELOG.md', '# Hello'),
  ])

  expect(await firstRelease()).toEqual(false)

  refresh()

  prepare([packageJson('my-unreleased-package'), file('index.js', "console.log('unreleased')")])
  expect(await firstRelease()).toEqual(true)
})

test('Validates package properties before release.', () => {
  prepare([
    packageJson('release-validate', {
      version: '1.0.0',
    }),
    file('index.js', ''),
  ])

  expect(mockExit).not.toHaveBeenCalled()

  // All required fields.
  validatePackage({
    pkg: {
      version: '1.0.0',
      license: 'MIT',
      author: 'Matthias Giger',
      keywords: ['plugin'],
      files: ['index.js'],
      main: 'index.js',
      exports: { default: 'index.js' },
    },
  })

  expect(mockExit).not.toHaveBeenCalled()

  validatePackage({
    pkg: {
      main: 'index.js',
      // Missing these fields only leads to warnings.
      keywords: ['plugin'],
      files: ['index.js'],
      exports: { default: 'index.js' },
    },
  })

  expect(mockExit.mock.calls.length).toBe(3)

  validatePackage({
    pkg: {
      main: 'index.js',
    },
  })

  expect(mockExit.mock.calls.length).toBe(6)
})

test('Released as version specified in package.json if not yet released.', async () => {
  const manifest = await pacote.manifest('debug')

  let version = await releaseAs({
    pkg: {
      // Current release version for debug.
      version: manifest.version,
      name: 'debug',
    },
  })

  expect(version).toBeUndefined()

  version = await releaseAs({
    pkg: {
      // Not yet released.
      version: '123.0.0',
      name: 'debug',
    },
  })

  expect(version).toBe('123.0.0')
})
