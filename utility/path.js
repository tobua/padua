import { join } from 'path'

export const getProjectBasePath = () => {
  // CWD during postinstall is in package, otherwise in project.
  const currentWorkingDirectory = process.cwd()

  if (currentWorkingDirectory.includes('node_modules/padua') || currentWorkingDirectory.includes('node_modules\\padua')) {
    return join(currentWorkingDirectory, '../..')
  }

  return currentWorkingDirectory
}
