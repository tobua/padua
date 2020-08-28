import ncu from 'npm-check-updates'
import log from 'logua'

export default async () => {
  log('checking for updates..')

  const upgrades = await ncu.run({
    upgrade: true,
  })

  if (Object.keys(upgrades).length === 0) {
    return log('everything already up-to-date')
  }

  log('upgrade done')

  Object.keys(upgrades).forEach((key) => {
    const version = upgrades[key]

    console.log(`${key} → ${version}`)
  })

  console.log('')
}
