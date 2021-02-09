import { existsSync, readFileSync } from 'fs'
import { join } from 'path'
import rimraf from 'rimraf'
import { writeGitIgnore, writePackageJson } from '../utility/configuration.js'
import { refresh } from '../utility/helper.js'

const CWD = process.cwd()
const cwdSpy = jest.spyOn(process, 'cwd')

beforeEach(() => refresh())

test('Generates gitignore with default entries.', () => {
  const fixturePath = join(CWD, 'test/fixture/gitignore')
  const gitignorePath = join(fixturePath, '.gitignore')
  cwdSpy.mockReturnValue(fixturePath)

  rimraf.sync(gitignorePath)

  writeGitIgnore([])

  expect(existsSync(gitignorePath)).toEqual(true)

  const contents = readFileSync(gitignorePath, 'utf8')

  expect(contents).toEqual(
    ['node_modules', 'package-lock.json', 'jsconfig.json', 'dist', ''].join(
      '\r\n'
    )
  )

  rimraf.sync(gitignorePath)
})

test('Generates proper gitignore for typescript.', () => {
  const fixturePath = join(CWD, 'test/fixture/typescript')
  const gitignorePath = join(fixturePath, '.gitignore')
  cwdSpy.mockReturnValue(fixturePath)

  rimraf.sync(gitignorePath)

  writeGitIgnore([])

  expect(existsSync(gitignorePath)).toEqual(true)

  const contents = readFileSync(gitignorePath, 'utf8')

  expect(contents).toEqual(
    ['node_modules', 'package-lock.json', 'tsconfig.json', 'dist', ''].join(
      '\r\n'
    )
  )

  rimraf.sync(gitignorePath)
})

test('No output folder when source mode active.', () => {
  const fixturePath = join(CWD, 'test/fixture/source')
  const gitignorePath = join(fixturePath, '.gitignore')
  cwdSpy.mockReturnValue(fixturePath)

  rimraf.sync(gitignorePath)

  writeGitIgnore([])

  expect(existsSync(gitignorePath)).toEqual(true)

  const contents = readFileSync(gitignorePath, 'utf8')

  expect(contents).toEqual(
    ['node_modules', 'package-lock.json', 'jsconfig.json', ''].join('\r\n')
  )

  rimraf.sync(gitignorePath)
})

test('Updates old package json properties.', () => {
  const fixturePath = join(CWD, 'test/fixture/source')
  const packageJsonPath = join(fixturePath, 'package.json')
  cwdSpy.mockReturnValue(fixturePath)

  let pkg = JSON.parse(readFileSync(packageJsonPath, 'utf8'))

  expect(pkg.engines.node).toEqual('>= 13.2.0')

  writePackageJson()

  pkg = JSON.parse(readFileSync(packageJsonPath, 'utf8'))

  expect(pkg.engines.node).toEqual('>= 14')
})
