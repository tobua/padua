import { existsSync, writeFileSync, readFileSync } from 'fs'
import { join } from 'path'
import glob from 'fast-glob'
import objectAssignDeep from 'object-assign-deep'
import { log } from './log.js'
import { getProjectBasePath } from './path.js'
import { cache } from './helper.js'

const emptyFileTemplate = `
// This is the entry file for your plugin.
// If you want to use TypeScript rename it to index.ts
// To enable/disable React adapt the ending .jsx .tsx (React) .js .ts (no React)
// or install React as a dependency or better peerDependency.
`

// Default options.
const defaultOptions = {
  source: false,
  output: 'dist',
  typescript: false,
  react: false,
  test: false,
  entry: [],
}

export const getOptions = cache(() => {
  let packageContents
  const options = { ...defaultOptions, entry: [] }

  try {
    packageContents = readFileSync(
      join(getProjectBasePath(), 'package.json'),
      'utf8'
    )
    packageContents = JSON.parse(packageContents)
  } catch (error) {
    log('unable to load package.json', 'error')
  }

  if (typeof packageContents.padua === 'object') {
    // Include project specific overrides
    objectAssignDeep(options, packageContents.padua)

    if (typeof options.entry === 'string') {
      options.entry = [options.entry]
    }
  }

  ;['index', 'src/index'].forEach((entry) =>
    ['js', 'ts', 'jsx', 'tsx'].forEach((extension) => {
      const entryFilePath = `${entry}.${extension}`

      if (existsSync(join(getProjectBasePath(), entryFilePath))) {
        options.entry.push(entryFilePath)
      }
    })
  )

  options.entry.forEach((entry) => {
    if (/tsx?$/.test(entry)) {
      options.typescript = true
    }

    if (/[tj]sx$/.test(entry)) {
      options.react = true
    }
  })

  if (
    Object.keys(packageContents.dependencies || {}).includes('react') ||
    Object.keys(packageContents.peerDependencies || {}).includes('react')
  ) {
    options.react = true
  }

  if (!options.entry) {
    const entryFile = `index.${options.react ? 'jsx' : 'js'}`

    writeFileSync(join(getProjectBasePath(), entryFile), emptyFileTemplate)

    log(`No entry file found, created one in ${entryFile}`)

    options.entry = entryFile
  }

  const testFiles = glob.sync(['test/**.test.?s*'], {
    cwd: getProjectBasePath(),
  })

  if (testFiles.length > 0) {
    options.test = true
  }

  options.pkg = packageContents

  return options
})
