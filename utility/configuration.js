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
import { tsconfig } from '../configuration/tsconfig.js'
import { jsconfig } from '../configuration/jsconfig.js'
import { packageJson } from '../configuration/package.js'
import { log } from './log.js'
import { getOptions } from './options.js'

const options = getOptions()

const getProjectBasePath = () => {
  // CWD during postinstall is in package, otherwise in project.
  const currentWorkingDirectory = process.cwd()

  if (currentWorkingDirectory.includes('node_modules/padua')) {
    return join(currentWorkingDirectory, '../..')
  }

  return currentWorkingDirectory
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

  const [userConfig, packageConfig] = getConfiguration(options)

  Object.assign(userConfig, userConfigOverrides)

  // If package tsconfig can be written, adapt it and only extend user config.
  if (accessSync(packageTSConfigPath, constants.W_OK)) {
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
  } else {
    // Package config cannot be written, write full contents to user file.
    try {
      delete userConfig.extends
      // TODO remove ../../..
      Object.assign(userConfig, packageConfig)
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
}

const writeTSConfig = (tsConfigUserOverrides = {}) => {
  writePackageAndUserFile(
    !options.typescript,
    'tsconfig.json',
    tsconfig,
    tsConfigUserOverrides
  )
}

const writeJSConfig = (jsConfigUserOverrides = {}) => {
  writePackageAndUserFile(
    options.typescript,
    'jsconfig.json',
    jsconfig,
    jsConfigUserOverrides
  )
}

const writePackageJson = () => {
  const packageJsonPath = join(getProjectBasePath(), './package.json')

  let packageContents = readFileSync(packageJsonPath, 'utf8')
  packageContents = JSON.parse(packageContents)

  // Merge existing configuration with additional required attributes.
  objectAssignDeep(packageContents, packageJson())

  // Format with prettier and sort before writing.
  writeFileSync(packageJsonPath, formatJson(JSON.stringify(packageContents)))

  if (!packageContents.padua) {
    packageContents.padua = {}
  }

  return { packageContents }
}

export const writeConfiguration = () => {
  const { packageContents } = writePackageJson()
  writeJSConfig(packageContents.padua.jsconfig)
  writeTSConfig(packageContents.padua.tsconfig)
  return { packageContents }
}
