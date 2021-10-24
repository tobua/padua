import { existsSync } from 'fs'
import { join } from 'path'
import { execSync } from 'child_process'
import standardVersion from 'standard-version'
import branchName from 'current-git-branch'
import pacote from 'pacote'
import build from './build.js'
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

const failMissingPackageField = (field, type = 'error') => {
  log(
    `package.json ${
      type === 'error' ? 'requires' : 'should have'
    } a ${field} for the package to release`,
    type
  )
}

// Release with yet unreleased version specified in package.json.
export const releaseAs = async (options = getOptions()) => {
  try {
    const manifest = await pacote.manifest(options.pkg.name)

    if (options.pkg.version !== manifest.version) {
      return options.pkg.version
    }
  } catch (error) {
    return undefined
  }
  return undefined
}

export const validatePackage = (options) => {
  if (!options.pkg.version) {
    failMissingPackageField('version')
  }

  if (!options.pkg.license) {
    failMissingPackageField('license')
  }

  if (!options.pkg.author) {
    failMissingPackageField('author')
  }

  if (!options.pkg.keywords) {
    failMissingPackageField('keywords', 'warning')
  }

  if (!options.pkg.files) {
    failMissingPackageField('files', 'warning')
  }

  if (!options.pkg.main && !options.pkg.exports && !options.pkg.bin) {
    failMissingPackageField('main or exports')
  }

  if (!options.pkg.exports) {
    failMissingPackageField('exports', 'warning')
  }
}

export default async () => {
  const branch = branchName()
  const options = getOptions()

  if (branch !== 'main' && branch !== 'master') {
    log(`Releasing from ${branch} branch`, 'warning')
  }

  validatePackage(options)

  if (!options.source) {
    await build(options)
  }

  const isFirstRelease = await firstRelease(options)

  if (!isFirstRelease && !checkOwner(options)) {
    log(
      "You're not logged in or not the owner of this package you want to publish",
      'error'
    )
  }

  try {
    await standardVersion({
      firstRelease: isFirstRelease,
      releaseAs: await releaseAs(options),
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
    execSync('npm publish', { stdio: 'inherit' })
    log('package published to npm')
  }
}
