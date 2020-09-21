import { existsSync, writeFileSync, readFileSync } from 'fs'
import { join } from 'path'
import { log } from './log.js'

const commonEntries = ['index', 'src/index']
const extensions = [
  {
    name: 'js',
    typescript: false,
    react: false,
  },
  {
    name: 'ts',
    typescript: true,
    react: false,
  },
  {
    name: 'jsx',
    typescript: false,
    react: true,
  },
  {
    name: 'tsx',
    typescript: true,
    react: true,
  },
]
const emptyFileTemplate = `
// This is the entry file for your plugin.
// If you want to use TypeScript rename it to index.ts
// To enable/disable React adapt the ending .jsx .tsx (React) .js .ts (no React)
// or install React as a dependency or better peerDependency.
`

let packageContents

try {
  packageContents = readFileSync(join(process.cwd(), 'package.json'), 'utf8')
  packageContents = JSON.parse(packageContents)
} catch (error) {
  log('unable to load package.json', 'error')
}

let loaded = false

// Default options.
const options = {
  // No build step, directly publish source files.
  source: false,
  // Separate entry for CLI.
  cli: false,
  // Is project written in TypeScript.
  typescript: false,
  // Does the project include React.
  react: false,
  // Are there any tests.
  test: false,
  // What's the name of the entry file (defaults: index.[jt]sx?).
  entry: null,
}

export const getOptions = () => {
  if (loaded) {
    return options
  }

  if (typeof packageContents.padua === 'object') {
    // Include project specific overrides
    Object.assign(options, packageContents.padua)
  }

  commonEntries.forEach((entry) =>
    extensions.forEach((extension) => {
      const entryFilePath = `${entry}.${extension.name}`

      if (existsSync(join(process.cwd(), entryFilePath))) {
        options.entry = entryFilePath
        options.typescript = extension.typescript
        options.react = extensions.react
      }
    })
  )

  if (
    Object.keys(packageContents.dependencies || {}).includes('react') ||
    Object.keys(packageContents.peerDependencies || {}).includes('react')
  ) {
    options.react = true
  }

  if (!options.entry) {
    const entryFile = `index.${options.react ? 'jsx' : 'js'}`

    writeFileSync(join(process.cwd(), entryFile), emptyFileTemplate)

    log(`No entry file found, created one in ${entryFile}`)

    options.entry = entryFile
  }

  // TODO Check if there are any test files present.
  if (existsSync(join(process.cwd(), 'test'))) {
    options.test = true
  }

  loaded = true

  return options
}
