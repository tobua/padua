import { readFileSync, statSync } from 'fs'
import { join } from 'path'
import { performance } from 'perf_hooks'
import glob from 'fast-glob'
import { gzipSizeSync } from 'gzip-size'
import { filesize } from 'filesize'
import { execSync, spawn } from 'child_process'
import stripAnsi from 'strip-ansi'
import { build } from 'esbuild'
import rimraf from 'rimraf'
import { log } from '../utility/log.js'
import { getProjectBasePath } from '../utility/path.js'
import { esbuildConfiguration } from '../configuration/esbuild.js'

// Print stats for generated assets.
const printDistStats = (options) => {
  const files = glob.sync('**/*.js', { cwd: options.output })
  files.forEach((file) => {
    const filePath = join(getProjectBasePath(), `dist/${file}`)
    const fileStream = readFileSync(filePath)
    console.log(
      `${file}: ${filesize(statSync(filePath).size)} (${filesize(
        gzipSizeSync(fileStream)
      )} gzipped)`
    )
  })
  if (files.length) {
    console.log('')
  }
}

const javaScriptBuild = async (options, watch, tsconfigPath) => {
  if (watch) {
    // eslint-disable-next-line no-param-reassign
    watch = {
      onRebuild: (error) => {
        // Error is ignored as it's already printed to the console.
        if (!error) {
          if (options.typescript) {
            console.log('')
          }
          log('rebuilding...')
          printDistStats(options)
        }
      },
    }
  }

  const buildOptions = esbuildConfiguration(watch, tsconfigPath)

  // Will print errors and warnings to the console.
  try {
    await build(buildOptions)
  } catch (error) {
    // Won't keep watching if initial build fails.
    process.exit(1)
  }

  printDistStats(options)
}

const emitTypeScriptDeclarations = (tsconfigPath, watch) => {
  if (watch) {
    const { stdout, stderr } = spawn('tsc', [
      '--project',
      `"${tsconfigPath}"`,
      '--emitDeclarationOnly',
      '--watch',
    ], {
      cwd: process.cwd(),
      shell: true
    })
    const removeNewLines = /(\r\n|\n|\r)/gm
    stdout.on('data', (data) =>
      console.log(stripAnsi(data.toString().replace(removeNewLines, '')))
    )
    stderr.on('data', (data) => console.log(stripAnsi(data.toString())))
  } else {
    try {
      const timeBefore = performance.now()
      execSync(
        `tsc --project "${tsconfigPath}" --emitDeclarationOnly`,
        {
          stdio: 'inherit',
        }
      )
      const timeAfter = performance.now()
      log(
        `TypeScript check fine (in ${Math.round(
          (timeAfter - timeBefore) / 1000
        )}s)`
      )
    } catch (error) {
      // Error already printed.
    }
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

  if (options.typescript) {
    tsconfigPath = join(process.cwd(), 'tsconfig.json')
    emitTypeScriptDeclarations(tsconfigPath, watch)
  }

  return javaScriptBuild(options, watch, tsconfigPath)
}
