import { join } from 'path'
import { readFileSync, writeFileSync, existsSync } from 'fs'
import { execSync } from 'child_process'
import rimraf from 'rimraf'
import { formatJson } from '../utility/format-json.js'
import { log } from '../utility/log.js'

// Extend user configuration with default configuration.
const extendUserConfiguration = (
  userConfiguration,
  defautConfigurationPath,
  userConfigurationPath
) => {
  // This way extends will be the property at the top.
  userConfiguration = Object.assign(
    {
      extends: defautConfigurationPath,
    },
    userConfiguration
  )

  userConfiguration = JSON.stringify(userConfiguration)

  userConfiguration = formatJson(userConfiguration)

  writeFileSync(userConfigurationPath, userConfiguration)
}

// Check if user configuration is available and extend if necessary.
// Returns path to entry config.
const verifyUserConfiguration = (userConfigurationPath) => {
  let userConfiguration
  let outDir = 'dist'
  let defautConfigurationPath = 'padua/configuration/tsconfig'

  if (!existsSync(userConfigurationPath)) {
    return [false, `./node_modules/${defautConfigurationPath}.json`, outDir]
  }

  try {
    userConfiguration = JSON.parse(readFileSync(userConfigurationPath, 'utf8'))
  } catch (_) {
    log(`Couldn't parse tsconfig in ${userConfigurationPath}`, 'error')
    return [true]
  }

  if (
    userConfiguration &&
    userConfiguration.extends !== defautConfigurationPath
  ) {
    extendUserConfiguration(
      userConfiguration,
      defautConfigurationPath,
      userConfigurationPath
    )
  }

  if (
    userConfiguration.compilerOptions &&
    userConfiguration.compilerOptions.outDir
  ) {
    outDir = userConfiguration.compilerOptions.outDir
  }

  return [false, userConfigurationPath, outDir]
}

export default (watch) => {
  const userConfigurationPath = join(process.cwd(), 'tsconfig.json')

  const [error, configurationPath, outDir] = verifyUserConfiguration(
    userConfigurationPath
  )

  if (error) {
    return
  }

  let command = `tsc --project ${configurationPath}`

  if (watch) {
    command += ' --watch'
  }

  if (watch) {
    log('watching..')
  } else {
    log('building..')
  }

  // Cleanup dist folder.
  rimraf.sync(join(process.cwd(), outDir))

  try {
    execSync(command, { stdio: 'inherit' })
  } catch (error) {
    log(error, 'error')
  }
}
