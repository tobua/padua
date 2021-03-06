import {
  accessSync,
  existsSync,
  constants,
  readFileSync,
  writeFileSync,
  unlinkSync,
} from 'fs'
import { join } from 'path'
import formatJson from 'pakag'
import merge from 'deepmerge'
import deepForEach from 'deep-for-each'
import parse from 'parse-gitignore'
import get from 'lodash.get'
import set from 'lodash.set'
import isCI from 'is-ci'
import { tsconfig } from '../configuration/tsconfig.js'
import { jsconfig } from '../configuration/jsconfig.js'
import { packageJson } from '../configuration/package.js'
import { gitignore } from '../configuration/gitignore.js'
import { log } from './log.js'
import { getOptions } from './options.js'
import { getProjectBasePath } from './path.js'
import { readPackageJsonFile, writePackageJsonFile } from './file.js'

const writeUserAndPackageConfig = (
  filename,
  userConfig,
  packageConfig,
  userTSConfigPath,
  packageTSConfigPath
) => {
  try {
    writeFileSync(
      packageTSConfigPath,
      formatJson(JSON.stringify(packageConfig), { sort: false })
    )
    writeFileSync(
      userTSConfigPath,
      formatJson(JSON.stringify(userConfig), { sort: false })
    )
  } catch (_) {
    log(
      `Couldn't write ${filename}, therefore this plugin might not work as expected`,
      'warning'
    )
  }
}

// remove ../../.. to place config in project root.
const adaptConfigToRoot = (packageConfig) => {
  deepForEach(packageConfig, (value, key, subject) => {
    const baseFromPackagePath = '../../../'
    if (typeof value === 'string' && value.includes(baseFromPackagePath)) {
      // eslint-disable-next-line no-param-reassign
      subject[key] = value.replace(baseFromPackagePath, '')
    }
    if (value === '../../..') {
      subject[key] = '.'
    }
  })
}

const writeOnlyUserConfig = (
  filename,
  userConfig,
  packageConfig,
  userTSConfigPath
) => {
  try {
    // eslint-disable-next-line no-param-reassign
    delete userConfig.extends
    adaptConfigToRoot(packageConfig)
    // eslint-disable-next-line no-param-reassign
    userConfig = merge(userConfig, packageConfig)
    writeFileSync(
      userTSConfigPath,
      formatJson(JSON.stringify(userConfig), { sort: false })
    )
  } catch (_) {
    log(
      `Couldn't write ${filename}, therefore this plugin might not work as expected`,
      'warning'
    )
  }
}

const writePackageAndUserFile = (
  shouldRemove,
  filename,
  getConfiguration,
  userConfigOverrides
) => {
  const userTSConfigPath = join(getProjectBasePath(), `./${filename}`)
  const packageTSConfigPath = join(
    getProjectBasePath(),
    `./node_modules/padua/configuration/${filename}`
  )

  if (shouldRemove) {
    if (existsSync(userTSConfigPath)) {
      unlinkSync(userTSConfigPath)
    }

    return
  }

  const [userConfig, packageConfig] = getConfiguration(userConfigOverrides)

  try {
    // If package tsconfig can be written, adapt it and only extend user config.
    accessSync(
      packageTSConfigPath,
      // eslint-disable-next-line no-bitwise
      constants.F_OK | constants.R_OK | constants.W_OK
    )
    writeUserAndPackageConfig(
      filename,
      userConfig,
      packageConfig,
      userTSConfigPath,
      packageTSConfigPath
    )
  } catch (_) {
    // Package config cannot be written, write full contents to user file.
    writeOnlyUserConfig(filename, userConfig, packageConfig, userTSConfigPath)
  }
}

const writeTSConfig = (tsConfigUserOverrides = {}) => {
  writePackageAndUserFile(
    !getOptions().typescript,
    'tsconfig.json',
    tsconfig,
    tsConfigUserOverrides
  )
}

const writeJSConfig = (jsConfigUserOverrides = {}) => {
  writePackageAndUserFile(
    getOptions().typescript,
    'jsconfig.json',
    jsconfig,
    jsConfigUserOverrides
  )
}

export const writeGitIgnore = (gitIgnoreOverrides = []) => {
  const gitIgnorePath = join(getProjectBasePath(), '.gitignore')
  let entries = []

  if (existsSync(gitIgnorePath)) {
    entries = entries.concat(parse(readFileSync(gitIgnorePath, 'utf8')))
  }

  entries = entries.concat(gitignore(gitIgnoreOverrides))

  // Remove duplicates, add empty line at the end
  entries = [...new Set(entries), '']

  writeFileSync(gitIgnorePath, entries.join('\r\n'))
}

const resetIgnoredProperties = (pkg) => {
  if (!(typeof pkg.padua === 'object')) {
    return
  }

  const ignoreProperties = pkg.padua.ignorePkgProperties

  if (!Array.isArray(ignoreProperties) || ignoreProperties.length < 1) {
    return
  }

  const initialPkg = readPackageJsonFile()

  ignoreProperties.forEach((property) => {
    const initialValue = get(initialPkg, property)
    const currentValue = get(pkg, property)

    // No change was made, or path non-existant.
    if (!currentValue) {
      return
    }

    set(pkg, property, initialValue)
  })
}

export const writePackageJson = () => {
  let contents = readPackageJsonFile()
  const isInitial = packageJson.isInitial(contents)

  if (isInitial) {
    // Merge existing configuration with initial default properties.
    contents = merge(packageJson.initial(), contents)
  }

  // Certain properties should be kept up-to-date.
  // Don't make updates in CI to avoid surprises.
  if (!isCI || typeof jest !== 'undefined') {
    packageJson.update(contents)
  }

  // Add properties subject to change based on files present in the project.
  packageJson.switchable(contents)

  resetIgnoredProperties(contents)

  writePackageJsonFile(contents)

  if (!contents.padua) {
    contents.padua = {}
  }

  return { packageContents: contents }
}

export const writeConfiguration = () => {
  const { packageContents } = writePackageJson()
  writeJSConfig(packageContents.padua.jsconfig)
  writeTSConfig(packageContents.padua.tsconfig)
  writeGitIgnore(packageContents.padua.gitignore)
  return { packageContents }
}
