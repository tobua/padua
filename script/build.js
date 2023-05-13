import { readFileSync, statSync, rmSync, existsSync } from 'fs'
import { join } from 'path'
import { performance } from 'perf_hooks'
import glob from 'fast-glob'
import { gzipSizeSync } from 'gzip-size'
import { filesize } from 'filesize'
import { execSync, spawn } from 'child_process'
import stripAnsi from 'strip-ansi'
import esbuild from 'esbuild'
import { log } from '../utility/log.js'
import { getProjectBasePath } from '../utility/path.js'
import { esbuildConfiguration } from '../configuration/esbuild.js'

// Print stats for generated assets.
const printDistStats = (options) => {
  const files = glob.sync('**/*.js', {
    cwd: join(process.cwd(), options.output),
  })
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
  // Print stats after build.
  const onEndPlugin = {
    name: 'on-end-plugin',
    setup(build) {
      build.onEnd((result) => {
        const hasErrors = result.errors.length

        // Error is ignored as it's already printed to the console.
        if (!hasErrors) {
          if (options.typescript) {
            console.log('')
          }
          // result.outputFiles is empty, therefore reading manually.
          printDistStats(options)
        }
      })
    },
  }

  const buildOptions = esbuildConfiguration(tsconfigPath)
  let context

  // Will print errors and warnings to the console.
  try {
    context = await esbuild.context({ ...buildOptions, plugins: [onEndPlugin] })
    // First build has to be triggered manually.
    await context.rebuild()
  } catch (error) {
    // Won't keep watching if initial build fails.
    process.exit(1)
  }

  if (watch) {
    context.watch()
  }

  if (!watch) {
    await context.dispose()
  }

  return () => context.dispose()
}

const emitTypeScriptDeclarations = (tsconfigPath, watch) => {
  if (watch) {
    const { stdout, stderr } = spawn(
      'tsc',
      ['--project', `"${tsconfigPath}"`, '--emitDeclarationOnly', '--watch'],
      {
        cwd: process.cwd(),
        shell: true,
      }
    )
    const removeNewLines = /(\r\n|\n|\r)/gm
    stdout.on('data', (data) =>
      console.log(stripAnsi(data.toString().replace(removeNewLines, '')))
    )
    stderr.on('data', (data) => console.log(stripAnsi(data.toString())))
  } else {
    try {
      const timeBefore = performance.now()
      execSync(`tsc --project "${tsconfigPath}" --emitDeclarationOnly`, {
        stdio: 'inherit',
      })
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
    !additionalArguments.includes('--no-clean') &&
    existsSync(join(process.cwd(), options.output))
  ) {
    rmSync(join(process.cwd(), options.output), { recursive: true })
  }

  if (options.typescript) {
    tsconfigPath = join(process.cwd(), 'tsconfig.json')
    emitTypeScriptDeclarations(tsconfigPath, watch)
  }

  return javaScriptBuild(options, watch, tsconfigPath)
}
