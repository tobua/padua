import { readFileSync, statSync } from 'fs'
import { join } from 'path'
import glob from 'fast-glob'
import gzipSize from 'gzip-size'
import filesize from 'filesize'
import { execSync } from 'child_process'
import esbuild from 'esbuild'
import chokidar from 'chokidar'
import rimraf from 'rimraf'
import { log } from '../utility/log.js'
import { getProjectBasePath } from '../utility/path.js'
import { esbuildConfiguration } from '../configuration/esbuild.js'

const singleJavaScriptBuild = async (configurationPath) => {
  const buildOptions = esbuildConfiguration(configurationPath)

  try {
    const { warnings } = await esbuild.build(buildOptions)

    if (warnings.length) {
      log(warnings, 'warning')
    }
  } catch (error) {
    log(error, 'error')
    process.exit(1)
  }

  glob
    .sync('**/*.js', {
      cwd: 'dist',
    })
    .forEach((file) => {
      const filePath = join(getProjectBasePath(), `dist/${file}`)
      const fileStream = readFileSync(filePath)
      console.log(
        `${file}: ${filesize(statSync(filePath).size)} (${filesize(
          gzipSize.sync(fileStream)
        )} gzipped)`
      )
    })
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
    log('watching...')
  } else {
    log('building...')
  }

  // Cleanup dist folder.
  rimraf.sync(join(process.cwd(), options.output))

  try {
    execSync(command, { stdio: 'inherit' })
  } catch (_error) {
    log(_error, 'error')
  }

  if (!watch) {
    singleJavaScriptBuild(configurationPath)
  }
}

const rebuildJavaScript = async (service, configurationPath) => {
  const buildOptions = esbuildConfiguration(configurationPath)

  try {
    await service.build(buildOptions)
    log('built')
  } catch (error) {
    log(error, 'error')
  }
}

const javascript = async (watch) => {
  if (watch) {
    const service = await esbuild.startService()

    const watcher = chokidar.watch('**/*.js', {
      ignored: [/node_modules/, 'dist', 'demo', 'test'],
      // Ignore files that have just been built.
      ignoreInitial: true,
    })

    const buildHandler = rebuildJavaScript.bind(null, service)

    watcher
      .on('change', buildHandler)
      .on('add', buildHandler)
      .on('unlink', buildHandler)

    process.on('SIGINT', () => {
      service.stop()
      process.exit(0)
    })

    await rebuildJavaScript(service)

    return log('watching..')
  }

  log('building...')

  return singleJavaScriptBuild()
}

export default (options, watch) => {
  if (options.source) {
    log(`Trying to build while in source mode`, 'error')
  }

  if (options.typescript) {
    return typescript(options, watch)
  }

  return javascript(watch)
}
