import { execSync } from 'child_process'
import standardVersion from 'standard-version'
import { log } from '../utility/log.js'

export default async () => {
  // TODO build, lint and test before publish
  try {
    const result = await standardVersion()
    console.log('tes', result)
  } catch (error) {
    log(`standard-version failed with message: ${error.message}`, 'error')
    process.exit()
  }

  execSync('git push --follow-tags origin master')

  log('git tag pushed')

  execSync('npm publish')

  log('package published to npm')
}
