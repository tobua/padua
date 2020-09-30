import skip from 'skip-local-postinstall'
import { log } from './utility/log.js'
import { writeConfiguration } from './utility/configuration.js'

skip()

writeConfiguration()

log('installed successfully')
