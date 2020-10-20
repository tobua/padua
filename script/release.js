import { execSync } from 'child_process'
import standardVersion from 'standard-version'
import branchName from 'current-git-branch'
import { log } from '../utility/log.js'

export default async () => {
  const branch = branchName()

  if (branch !== 'master') {
    log(`Releasing from ${branch} branch`, 'warning')
  }

  // TODO build, lint and test before publish

  try {
    await standardVersion({
      firstRelease: process.argv.includes('--first', '--first-release'),
    })
  } catch (error) {
    log(`standard-version failed with message: ${error.message}`, 'error')
    process.exit(1)
  }

  if (!process.argv.includes('--no-push')) {
    execSync(`git push --follow-tags origin ${branch}`, { stdout: 'inherit' })
    log('git tag pushed')
  }

  if (!process.argv.includes('--no-publish')) {
    execSync('npm publish', { stdout: 'inherit' })
    log('package published to npm')
  }
}
