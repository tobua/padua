import { log } from './utility/log.js'
import { writeConfiguration } from './utility/configuration'

// Skip postinstall on local install.
// https://stackoverflow.com/a/53239387/3185545
const { INIT_CWD, PWD } = process.env
if (INIT_CWD === PWD || INIT_CWD.indexOf(PWD) === 0) {
  log(`Skipping 'postinstall' on local install`)
}

writeConfiguration()

log('installed successfully')
