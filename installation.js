import { skip } from 'skip-local-postinstall'
import { log } from './utility/log.js'
import { writeConfiguration } from './utility/configuration.js'
import { getWorkspacePaths, resetWorkspace, setWorkspace } from './utility/path.js'

skip()

const workspaces = await getWorkspacePaths()

// eslint-disable-next-line no-restricted-syntax
for (const workspacePath of workspaces) {
  setWorkspace(workspacePath)
  // eslint-disable-next-line no-await-in-loop
  await writeConfiguration()
}

resetWorkspace()

log('installed successfully')
