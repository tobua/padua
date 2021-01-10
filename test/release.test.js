import { join } from 'path'
import { checkOwner, firstRelease } from '../script/release.js'
import { refresh } from '../utility/helper.js'

const CWD = process.cwd()
const cwdSpy = jest.spyOn(process, 'cwd')

beforeEach(() => refresh())

test('Check if the package owner matches the logged in user.', () => {
  expect(checkOwner({ pkg: { name: 'padua' } })).toEqual(true)
  expect(checkOwner({ pkg: { name: 'react' } })).toEqual(false)
})

test("Checks if the package isn't yet released.", async () => {
  cwdSpy.mockReturnValue(join(CWD, 'test/fixture/released'))
  expect(await firstRelease()).toEqual(false)
  refresh()
  cwdSpy.mockReturnValue(join(CWD, 'test/fixture/unreleased'))
  expect(await firstRelease()).toEqual(true)
})
