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
import objectAssignDeep from 'object-assign-deep'
import deepForEach from 'deep-for-each'
import parse from 'parse-gitignore'
import { tsconfig } from '../configuration/tsconfig.js'
import { jsconfig } from '../configuration/jsconfig.js'
import { packageJson } from '../configuration/package.js'
import { gitignore } from '../configuration/gitignore.js'
import { log } from './log.js'
import { getOptions } from './options.js'
import { getProjectBasePath } from './path.js'

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
    objectAssignDeep(userConfig, packageConfig)
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

const writePackageJson = () => {
  const packageJsonPath = join(getProjectBasePath(), './package.json')

  let packageContents = readFileSync(packageJsonPath, 'utf8')
  packageContents = JSON.parse(packageContents)

  const generatedPackageJson = packageJson()

  // Merge existing configuration with additional required attributes.
  // Existing properties override generated configuration to allow
  // the user to configure it their way.
  objectAssignDeep(generatedPackageJson, packageContents)

  // Format with prettier and sort before writing.
  writeFileSync(
    packageJsonPath,
    formatJson(JSON.stringify(generatedPackageJson))
  )

  if (!generatedPackageJson.padua) {
    generatedPackageJson.padua = {}
  }

  return { packageContents: generatedPackageJson }
}

export const writeConfiguration = () => {
  const { packageContents } = writePackageJson()
  writeJSConfig(packageContents.padua.jsconfig)
  writeTSConfig(packageContents.padua.tsconfig)
  writeGitIgnore(packageContents.padua.gitignore)
  return { packageContents }
}
