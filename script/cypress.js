import { existsSync } from 'fs'
import { join } from 'path'
import { execSync } from 'child_process'
import { log } from '../utility/log.js'

export default () => {
  if (!existsSync(join(process.cwd(), 'node_modules/cypress'))) {
    log('Cypress not installed, installing now ...')
    execSync('npm install cypress --save-dev', { stdio: 'inherit' })
  }

  const additionalArguments = process.argv.slice(3)

  log('running tests..')

  execSync(
    `./node_modules/.bin/cypress open --config-file node_modules/padua/configuration/cypress.json ${additionalArguments.join(
      ' '
    )}`,
    { stdio: 'inherit' }
  )
}
