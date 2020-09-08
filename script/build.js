import { join } from 'path'
import { readFileSync, writeFileSync, existsSync } from 'fs'
import { execSync } from 'child_process'
import esbuild from 'esbuild'
import chokidar from 'chokidar'
import rimraf from 'rimraf'
import formatPackageJson from 'pakag'
import { getOptions } from '../utility/options.js'
import { log } from '../utility/log.js'

// Extend user configuration with default configuration.
const extendUserConfiguration = (
  userConfiguration,
  defaultConfigurationPath,
  userConfigurationPath
) => {
  // This way extends will be the property at the top.
  let newUserConfiguration = userConfiguration
  delete newUserConfiguration.extends
  newUserConfiguration = {
    extends: defaultConfigurationPath,
    ...newUserConfiguration,
  }

  newUserConfiguration = JSON.stringify(newUserConfiguration)

  newUserConfiguration = formatPackageJson(newUserConfiguration)

  writeFileSync(userConfigurationPath, newUserConfiguration)
}

// Check if user configuration is available and extend if necessary.
// Returns path to entry config.
const verifyUserConfiguration = (userConfigurationPath) => {
  let userConfiguration
  let outDir = 'dist'
  const defaultConfigurationPath = 'padua/configuration/tsconfig'

  if (!existsSync(userConfigurationPath)) {
    return [false, `./node_modules/${defaultConfigurationPath}.json`, outDir]
  }

  try {
    userConfiguration = JSON.parse(readFileSync(userConfigurationPath, 'utf8'))
  } catch (_) {
    log(`Couldn't parse tsconfig in ${userConfigurationPath}`, 'error')
    return [true]
  }

  if (
    userConfiguration &&
    userConfiguration.extends !== defaultConfigurationPath
  ) {
    extendUserConfiguration(
      userConfiguration,
      defaultConfigurationPath,
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

const singleJavaScriptBuild = async (options, configurationPath) => {
  const buildOptions = {
    // entryPoints needs to be an array.
    entryPoints: [options.entry],
    outdir: 'dist',
    minify: true,
    bundle: true,
    sourcemap: true,
    color: true,
    target: 'es2015',
    platform: 'browser',
    format: 'cjs',
  }

  if (options.react) {
    buildOptions.loader = { '.jsx': 'jsx', '.tsx': 'tsx' }
  }

  if (configurationPath) {
    buildOptions.tsconfig = configurationPath
  }

  try {
    const { warnings } = await esbuild.build(buildOptions)

    if (warnings.length) {
      log(warnings, 'warning')
    }
  } catch (error) {
    log(error, 'error')
    process.exit(1)
  }

  log('done')
}

const typescript = (options, watch) => {
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
  } else {
    // JS will be built with esbuild.
    command += ' --emitDeclarationOnly'
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
  } catch (_error) {
    log(_error, 'error')
  }

  if (!watch) {
    singleJavaScriptBuild(options, configurationPath)
  }
}

const rebuildJavaScript = async (service, options) => {
  try {
    const buildOptions = {
      // entryPoints needs to be an array.
      entryPoints: [options.entry],
      outdir: 'dist',
      minify: true,
      bundle: true,
      sourcemap: true,
      color: true,
      target: 'es2015',
      platform: 'browser',
      format: 'cjs',
    }

    if (options.react) {
      buildOptions.loader = { '.jsx': 'jsx', '.tsx': 'tsx' }
    }

    await service.build(buildOptions)
    log('built')
  } catch (error) {
    log(error, 'error')
  }
}

const javascript = async (options, watch) => {
  if (watch) {
    const service = await esbuild.startService()

    const watcher = chokidar.watch('**/*.js', {
      ignored: [/node_modules/, 'dist', 'demo', 'test'],
      // Ignore files that have just been built.
      ignoreInitial: true,
    })

    const buildHandler = rebuildJavaScript.bind(null, service, options)

    watcher
      .on('change', buildHandler)
      .on('add', buildHandler)
      .on('unlink', buildHandler)

    process.on('SIGINT', () => {
      service.stop()
      process.exit()
    })

    await rebuildJavaScript(service, options)

    return log('watching..')
  }

  log('building..')

  return singleJavaScriptBuild(options)
}

export default (watch) => {
  const options = getOptions()

  if (options.typescript) {
    return typescript(options, watch)
  }

  return javascript(options, watch)
}
