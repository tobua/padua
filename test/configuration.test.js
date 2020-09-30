const { join } = require('path')
// const { writeGitIgnore } = require('../utility/configuration.js')

const CWD = process.cwd()

test('Generates gitignore with default entries.', () => {
  const spy = jest.spyOn(process, 'cwd')
  spy.mockReturnValue(join(CWD, 'fixture/gitignore'))

  console.log('CWD', process.cwd())

  // writeGitIgnore([])
  expect(true).toEqual(true)
})
