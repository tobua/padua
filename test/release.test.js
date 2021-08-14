import isCI from 'is-ci'
import { environment, prepare, packageJson, file } from 'jest-fixture'
import { refresh } from '../utility/helper.js'
import { getOptions } from '../utility/options.js'
import { checkOwner, firstRelease, validatePackage } from '../script/release.js'

environment('release')

beforeEach(refresh)

const mockExit = jest.spyOn(process, 'exit').mockImplementation(() => {})

test('Check if the package owner matches the logged in user.', () => {
  if (!isCI) {
    expect(checkOwner({ pkg: { name: 'padua' } })).toEqual(true)
    expect(checkOwner({ pkg: { name: 'react' } })).toEqual(false)
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

  prepare([
    packageJson('my-unreleased-package'),
    file('index.js', "console.log('unreleased')"),
  ])
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
