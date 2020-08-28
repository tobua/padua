import { execSync } from 'child_process'
import standardVersion from 'standard-version'
import log from 'logua'

export default async () => {
  console.log(process.argv)
  // TODO build, lint and test before publish
  try {
    // TODO first release
    const result = await standardVersion({})
    console.log('tes', result)
  } catch (error) {
    log(`standard-version failed with message: ${error.message}`, 'error')
    process.exit()
  }

  execSync('git push --follow-tags origin master', { stdout: 'inherit' })

  log('git tag pushed')

  execSync('npm publish', { stdout: 'inherit' })

  log('package published to npm')
}
