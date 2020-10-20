import { execSync } from 'child_process'
import { log } from '../utility/log.js'

export default (options) => {
  if (!options.test) {
    log(`No tests found`, 'warning')
  }

  const additionalArguments = process.argv.slice(3)

  log('running tests..')

  execSync(`jest ${additionalArguments.join(' ')}`, { stdio: 'inherit' })
}
