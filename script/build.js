import { readFileSync, statSync } from 'fs'
import { join } from 'path'
import glob from 'fast-glob'
import gzipSize from 'gzip-size'
import filesize from 'filesize'
import { exec, execSync } from 'child_process'
import { build } from 'esbuild'
import rimraf from 'rimraf'
import { log } from '../utility/log.js'
import { getProjectBasePath } from '../utility/path.js'
import { esbuildConfiguration } from '../configuration/esbuild.js'

// Print stats for generated assets.
const printDistStats = (options) =>
  glob
    .sync('**/*.js', {
      cwd: options.output,
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

const javaScriptBuild = async (options, watch, tsconfigPath) => {
  if (watch) {
    // eslint-disable-next-line no-param-reassign
    watch = {
      onRebuild: (error) => {
        if (error) {
          log(error, 'error')
        } else {
          log('rebuilding...')
          printDistStats(options)
        }
      },
    }
  }

  const buildOptions = esbuildConfiguration(watch, tsconfigPath)

  try {
    const { errors, warnings } = await build(buildOptions)

    if (errors.length) {
      errors.forEach((error) => {
        log(error, 'error')
        process.exit(1)
      })
    }

    if (warnings.length) {
      warnings.forEach((warning) => {
        log(warning, 'warning')
      })
    }
  } catch (error) {
    log(error, 'error')
    process.exit(1)
  }

  printDistStats(options)
}

const emitTypeScriptDeclarations = (tsconfigPath, watch) => {
  let command = `tsc --project ${tsconfigPath} --emitDeclarationOnly`
  let script = execSync

  if (watch) {
    command += ' --watch'
    script = exec
  }

  try {
    script(command, { stdio: 'inherit' })
  } catch (_error) {
    log(_error, 'error')
  }
}

export default (options, watch) => {
  if (options.source) {
    log(`Trying to build while in source mode`, 'error')
  }

  log(watch ? 'watching...' : 'building...')

  const additionalArguments = process.argv.slice(2)
  let tsconfigPath

  // Cleanup dist folder, always to ensure esbuild will bundle the files.
  if (
    Array.isArray(additionalArguments) &&
    !additionalArguments.includes('--no-clean')
  ) {
    rimraf.sync(join(process.cwd(), options.output, '/*'))
  }

  // TODO run both in parallel.
  if (options.typescript) {
    tsconfigPath = join(process.cwd(), 'tsconfig.json')
    emitTypeScriptDeclarations(tsconfigPath, watch)
  }

  return javaScriptBuild(options, watch, tsconfigPath)
}
