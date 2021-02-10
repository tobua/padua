import { refresh } from '../utility/helper.js'
import { environment, prepare } from './utility/prepare.js'
import { checkOwner, firstRelease } from '../script/release.js'

const [fixturePath] = environment('release')

test('Check if the package owner matches the logged in user.', () => {
  expect(checkOwner({ pkg: { name: 'padua' } })).toEqual(true)
  expect(checkOwner({ pkg: { name: 'react' } })).toEqual(false)
})

test("Checks if the package isn't yet released.", async () => {
  prepare('released', fixturePath)
  expect(await firstRelease()).toEqual(false)

  refresh()

  prepare('unreleased', fixturePath)
  expect(await firstRelease()).toEqual(true)
})
