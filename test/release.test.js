import { join } from 'path'
import { checkOwner, firstRelease } from '../script/release.js'

const CWD = process.cwd()
const cwdSpy = jest.spyOn(process, 'cwd')

test('Check if the package owner matches the logged in user.', () => {
  expect(checkOwner({ pkg: { name: 'padua' } })).toEqual(true)
  expect(checkOwner({ pkg: { name: 'react' } })).toEqual(false)
})

test("Checks if the package isn't yet released.", async () => {
  cwdSpy.mockReturnValue(join(CWD, 'test/fixture/released'))
  expect(await firstRelease()).toEqual(false)
  cwdSpy.mockReturnValue(join(CWD, 'test/fixture/unreleased'))
  expect(await firstRelease()).toEqual(true)
})
