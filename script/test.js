import { execSync } from 'child_process'
import { log } from '../utility/log.js'

export default (options) => {
  if (!options.test) {
    log(`No tests found`, 'warning')
  }

  log('running tests..')
  execSync('jest', { stdio: 'inherit' })
}
