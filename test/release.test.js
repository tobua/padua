import { environment, prepare, packageJson, file } from 'jest-fixture'
import { refresh } from '../utility/helper.js'
import { checkOwner, firstRelease } from '../script/release.js'

environment('release')

beforeEach(refresh)

test('Check if the package owner matches the logged in user.', () => {
  expect(checkOwner({ pkg: { name: 'padua' } })).toEqual(true)
  expect(checkOwner({ pkg: { name: 'react' } })).toEqual(false)
})

test("Checks if the package isn't yet released.", async () => {
  prepare([
    packageJson('padua'),
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
