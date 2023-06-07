import { join } from 'path'
import { readFileSync } from 'fs'
import mapWorkspaces from '@npmcli/map-workspaces'
import { findRootSync } from '@manypkg/find-root'

let currentWorkspace = null

export const setWorkspace = (workspacePath) => {
  currentWorkspace = workspacePath
}

export const resetWorkspace = () => {
  currentWorkspace = null
}

export const getProjectBasePath = () => {
  // CWD during postinstall is in package, otherwise in project.
  const currentWorkingDirectory = currentWorkspace || process.cwd()

  if (
    currentWorkingDirectory.includes('node_modules/padua') ||
    currentWorkingDirectory.includes('node_modules\\padua')
  ) {
    return join(currentWorkingDirectory, '../..')
  }

  return currentWorkingDirectory
}

export const getWorkspacePaths = async () => {
  const basePath = findRootSync(process.env.INIT_CWD || getProjectBasePath()).rootDir
  const pkg = JSON.parse(readFileSync(join(basePath, 'package.json'), 'utf-8'))

  if (pkg && Array.isArray(pkg.workspaces)) {
    const workspaces = await mapWorkspaces({
      cwd: basePath,
      pkg,
    })

    const result = []

    Array.from(workspaces.values()).forEach((workspacePath) => {
      const { dependencies = {}, devDependencies = {} } = JSON.parse(
        readFileSync(join(workspacePath, 'package.json'), 'utf-8')
      )

      const list = Object.keys(dependencies).concat(Object.keys(devDependencies))
      const match = list.includes('padua')

      if (match) {
        result.push(workspacePath)
      }
    })

    return result
  }

  return [basePath]
}
