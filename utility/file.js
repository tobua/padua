import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'
import { formatPackageJson } from 'pakag'
import { getProjectBasePath } from './path.js'
import { log } from './log.js'

export const readPackageJsonFile = () => {
  const packageJsonPath = join(getProjectBasePath(), './package.json')

  try {
    const packageContents = readFileSync(packageJsonPath, 'utf8')
    return JSON.parse(packageContents)
  } catch (_) {
    return log('Error reading project package.json', 'error')
  }
}

export const writePackageJsonFile = async (contents) => {
  const packageJsonPath = join(getProjectBasePath(), './package.json')

  try {
    // Format with prettier and sort before writing.
    writeFileSync(packageJsonPath, await formatPackageJson(JSON.stringify(contents)))
  } catch (_) {
    log('Error writing to project package.json', 'error')
  }
}
