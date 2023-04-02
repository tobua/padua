import { skip } from 'skip-local-postinstall'
import { log } from './utility/log.js'
import { writeConfiguration } from './utility/configuration.js'
import { getWorkspacePaths, resetWorkspace, setWorkspace } from './utility/path.js'

skip()

const workspaces = await getWorkspacePaths()

workspaces.forEach((workspacePath) => {
  setWorkspace(workspacePath)
  writeConfiguration()
})

resetWorkspace()

log('installed successfully')
