import { join } from 'path'
import { execSync } from 'child_process'
import esbuild from 'esbuild'
import chokidar from 'chokidar'
import rimraf from 'rimraf'
import { getOptions } from '../utility/options.js'
import { log } from '../utility/log.js'
import { writeConfiguration } from '../utility/configuration'

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
  const configurationPath = join(process.cwd(), 'tsconfig.json')

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
  rimraf.sync(join(process.cwd(), options.output))

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
  writeConfiguration()
  const options = getOptions()

  if (options.typescript) {
    return typescript(options, watch)
  }

  return javascript(options, watch)
}
