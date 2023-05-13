import { existsSync, unlinkSync, rmSync } from 'fs'
import { join } from 'path'
import ncu from 'npm-check-updates'
import { execSync } from 'child_process'
import { log } from '../utility/log.js'
import { getProjectBasePath } from '../utility/path.js'

export default async () => {
  log('checking for updates..')

  const upgrades = await ncu.run({
    upgrade: true,
  })

  if (Object.keys(upgrades).length === 0) {
    return log('everything already up-to-date')
  }

  Object.keys(upgrades).forEach((key) => {
    const version = upgrades[key]

    console.log(`${key} → ${version}`)
  })

  console.log('')

  log('dependencies upgraded in package.json')

  log('reinstalling dependencies after upgrade...')

  // Cleanup before install.
  if (existsSync(join(process.cwd(), 'node_modules'))) {
    rmSync(join(process.cwd(), 'node_modules'), { recursive: true })
  }

  const packageLockFilePath = join(getProjectBasePath(), 'package-lock.json')

  if (existsSync(packageLockFilePath)) {
    unlinkSync(packageLockFilePath)
  }

  execSync('npm install', { stdio: 'inherit' })

  return log('new dependencies installed')
}
