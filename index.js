#!/usr/bin/env node

import { log } from './utility/log.js'
import * as scripts from './script/index.js'

let script = process.argv.slice(2)[0]

if (['watch', 'build', 'test', 'lint', 'release', 'update'].includes(script)) {
  const watch = script === 'watch'

  if (watch) {
    script = 'build'
  }

  scripts[script](watch)
} else {
  log('Please provide a valid script', 'error')
}
