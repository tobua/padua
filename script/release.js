import { existsSync } from 'fs'
import { join } from 'path'
import { execSync } from 'child_process'
import standardVersion from 'standard-version'
import branchName from 'current-git-branch'
import pacote from 'pacote'
import { log } from '../utility/log.js'
import { getProjectBasePath } from '../utility/path.js'
import { getOptions } from '../utility/options.js'

export const checkOwner = (options = getOptions()) => {
  const { name } = options.pkg
  let loggedInUser
  try {
    loggedInUser = execSync('npm whoami').toString().trim()
  } catch (error) {
    return false
  }
  let owners = execSync(`npm owner ls ${name}`).toString()
  owners = owners.match(/^[^( <)]+/gim)
  return owners.includes(loggedInUser)
}

export const firstRelease = async (options = getOptions()) => {
  const hasChangelog = existsSync(join(getProjectBasePath(), 'CHANGELOG.md'))
  let isReleased = false
  try {
    const manifest = await pacote.manifest(options.pkg.name)
    isReleased = !!manifest.version
  } catch (error) {
    isReleased = false
  }
  return !hasChangelog && !isReleased
}

export default async () => {
  const branch = branchName()
  const options = getOptions()

  if (branch !== 'master') {
    log(`Releasing from ${branch} branch`, 'warning')
  }

  if (!options.pkg.version) {
    log(`package.json requires a version for the package to release`, 'error')
  }

  // TODO build, lint and test before publish

  const isFirstRelease = firstRelease(options)

  if (!isFirstRelease && !checkOwner(options)) {
    log(
      "You're not logged in or not the owner of this package you want to publish",
      'error'
    )
  }

  try {
    await standardVersion({
      firstRelease: isFirstRelease,
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
